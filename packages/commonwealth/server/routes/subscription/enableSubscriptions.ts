import Sequelize from 'sequelize';
import { Request, Response, NextFunction } from 'express';
import Errors from './errors';
import { sequelize } from '../../database';
import { AppError, ServerError } from '../../util/errors';
import { factory, formatFilename } from 'common-common/src/logging';

const Op = Sequelize.Op;
const log = factory.getLogger(formatFilename(__filename));

export default async (models, req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError(Errors.NotLoggedIn));
  }
  if (!req.body['subscription_ids[]']) {
    return next(new AppError(Errors.NoSubscriptionId));
  }

  // subscription_ids[] comes either as a single string if there's one element, or as an array.
  // We need to handle both cases: in the former, we find the single subscription equal to the
  // one passed. In the latter, we find all subscription rows whose ids are within the provided list.
  let idOptions;
  if (typeof req.body['subscription_ids[]'] === 'string') {
    idOptions = { [Op.eq]: +req.body['subscription_ids[]'] };
  } else {
    idOptions = { [Op.in]: req.body['subscription_ids[]'].map((n) => +n) };
  }

  const subscriptions = await models.Subscription.findAll({
    where: { id: idOptions }
  });

  if (subscriptions.find((s) => s.subscriber_id !== req.user.id)) {
    return next(new AppError(Errors.NotUsersSubscription));
  }

  await sequelize.transaction(async (t) => {
    await Promise.all(subscriptions.map((s) => {
      s.is_active = true;
      return s.save({ transaction: t });
    }));
  });

  return res.json({ status: 'Success', result: 'Enabled subscriptions' });
};
