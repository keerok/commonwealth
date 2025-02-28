import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import moment from 'moment';
import { NotificationCategories, ProposalType } from 'common-common/src/types';
import { factory, formatFilename } from 'common-common/src/logging';
import { parseUserMentions } from '../util/parseUserMentions';
import validateChain from '../util/validateChain';
import lookupAddressIsOwnedByUser from '../util/lookupAddressIsOwnedByUser';
import { getProposalUrl, renderQuillDeltaToText, validURL } from '../../shared/utils';
import { DB } from '../database';
import BanCache from '../util/banCheckCache';
import { AppError, ServerError } from '../util/errors';

const log = factory.getLogger(formatFilename(__filename));

export const Errors = {
  NoThreadId: 'Must provide thread_id',
  NoBodyOrAttachment: 'Must provide body or attachment',
  IncorrectOwner: 'Not owned by this user',
  InvalidLink: 'Invalid thread URL',
};

const editThread = async (
  models: DB,
  banCache: BanCache,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body, title, kind, stage, thread_id, version_history, url } =
    req.body;
  if (!thread_id) {
    return next(new AppError(Errors.NoThreadId));
  }

  if (kind === 'discussion') {
    if (
      (!body || !body.trim()) &&
      (!req.body['attachments[]'] || req.body['attachments[]'].length === 0)
    ) {
      return next(new AppError(Errors.NoBodyOrAttachment));
    }
  }
  const [chain, error] = await validateChain(models, req.body);
  if (error) return next(new AppError(error));
  const [author, authorError] = await lookupAddressIsOwnedByUser(models, req);
  if (authorError) return next(new AppError(authorError));

  const attachFiles = async () => {
    if (
      req.body['attachments[]'] &&
      typeof req.body['attachments[]'] === 'string'
    ) {
      await models.Attachment.create({
        attachable: 'thread',
        attachment_id: thread_id,
        url: req.body['attachments[]'],
        description: 'image',
      });
    } else if (req.body['attachments[]']) {
      await Promise.all(
        req.body['attachments[]'].map((url_) =>
          models.Attachment.create({
            attachable: 'thread',
            attachment_id: thread_id,
            url: url_,
            description: 'image',
          })
        )
      );
    }
  };

  let thread;
  const userOwnedAddresses = await req.user.getAddresses();
  const userOwnedAddressIds = userOwnedAddresses
    .filter((addr) => !!addr.verified)
    .map((addr) => addr.id);
  const collaboration = await models.Collaboration.findOne({
    where: {
      thread_id,
      address_id: { [Op.in]: userOwnedAddressIds }
    }
  });

  const admin = await models.Role.findOne({
    where: {
      chain_id: chain.id,
      address_id: { [Op.in]: userOwnedAddressIds },
      permission: 'admin',
    },
  });

  // check if banned
  if (!admin) {
    const [canInteract, banError] = await banCache.checkBan({
      chain: chain.id,
      address: author.address,
    });
    if (!canInteract) {
      return next(new AppError(banError));
    }
  }

  if (collaboration || admin) {
    thread = await models.Thread.findOne({
      where: {
        id: thread_id,
      },
    });
  } else {
    thread = await models.Thread.findOne({
      where: {
        id: thread_id,
        address_id: { [Op.in]: userOwnedAddressIds },
      },
    });
  }
  if (!thread) return next(new AppError('No thread with that id found'));

  try {
    let latestVersion;
    try {
      latestVersion = JSON.parse(thread.version_history[0]).body;
    } catch (e) {
      console.log(e);
    }
    // If new comment body text has been submitted, create another version history entry
    if (decodeURIComponent(req.body.body) !== latestVersion) {
      const recentEdit: any = {
        timestamp: moment(),
        author: req.body.author,
        body: decodeURIComponent(req.body.body),
      };
      const versionHistory: string = JSON.stringify(recentEdit);
      const arr = thread.version_history;
      arr.unshift(versionHistory);
      thread.version_history = arr;
    }
    thread.body = body;
    thread.stage = stage;
    thread.plaintext = (() => {
      try {
        return renderQuillDeltaToText(JSON.parse(decodeURIComponent(body)));
      } catch (e) {
        return decodeURIComponent(body);
      }
    })();
    if (title) {
      thread.title = title;
    }
    if (url && thread.kind === 'link') {
      if (validURL(url)) {
        thread.url = url;
      } else {
        return next(new AppError(Errors.InvalidLink));
      }
    }

    await thread.save();
    await attachFiles();

    const finalThread = await models.Thread.findOne({
      where: { id: thread.id },
      include: [
        { model: models.Address, as: 'Address' },
        {
          model: models.Address,
          // through: models.Collaboration,
          as: 'collaborators',
        },
        models.Attachment,
        { model: models.Topic, as: 'topic' },
      ],
    });

    // dispatch notifications to subscribers of the given chain
    models.Subscription.emitNotifications(
      models,
      NotificationCategories.ThreadEdit,
      '',
      {
        created_at: new Date(),
        root_id: +finalThread.id,
        root_type: ProposalType.Thread,
        root_title: finalThread.title,
        chain_id: finalThread.chain,
        author_address: finalThread.Address.address,
        author_chain: finalThread.Address.chain,
      },
      // don't send webhook notifications for edits
      null,
      req.wss,
      [userOwnedAddresses[0].address]
    );

    let mentions;
    try {
      const previousDraftMentions = parseUserMentions(latestVersion);
      const currentDraftMentions = parseUserMentions(decodeURIComponent(body));
      mentions = currentDraftMentions.filter((addrArray) => {
        let alreadyExists = false;
        previousDraftMentions.forEach((addrArray_) => {
          if (
            addrArray[0] === addrArray_[0] &&
            addrArray[1] === addrArray_[1]
          ) {
            alreadyExists = true;
          }
        });
        return !alreadyExists;
      });
    } catch (e) {
      return next(new AppError('Failed to parse mentions'));
    }

    // grab mentions to notify tagged users
    let mentionedAddresses;
    if (mentions?.length > 0) {
      mentionedAddresses = await Promise.all(
        mentions.map(async (mention) => {
          try {
            const user = await models.Address.findOne({
              where: {
                chain: mention[0],
                address: mention[1],
              },
              include: [models.User, models.Role],
            });
            return user;
          } catch (err) {
            return null;
          }
        })
      );
      // filter null results
      mentionedAddresses = mentionedAddresses.filter((addr) => !!addr);
    }

    // notify mentioned users, given permissions are in place
    if (mentionedAddresses?.length > 0) {
      mentionedAddresses.map((mentionedAddress) => {
        if (!mentionedAddress.User) return; // some Addresses may be missing users, e.g. if the user removed the address

        models.Subscription.emitNotifications(
          models,
          NotificationCategories.NewMention,
          `user-${mentionedAddress.User.id}`,
          {
            created_at: new Date(),
            root_id: +finalThread.id,
            root_type: ProposalType.Thread,
            root_title: finalThread.title,
            comment_text: finalThread.body,
            chain_id: finalThread.chain,
            author_address: finalThread.Address.address,
            author_chain: finalThread.Address.chain,
          },
          {
            user: finalThread.Address.address,
            url: getProposalUrl('discussion', finalThread),
            title: req.body.title,
            bodyUrl: req.body.url,
            chain: finalThread.chain,
            body: finalThread.body,
          },
          req.wss,
          [finalThread.Address.address]
        );
      });
    }

    // TODO: update author.last_active

    return res.json({ status: 'Success', result: finalThread.toJSON() });
  } catch (e) {
    return next(new ServerError(e));
  }
};

export default editThread;
