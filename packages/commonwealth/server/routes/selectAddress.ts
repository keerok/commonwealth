import { Request, Response, NextFunction } from 'express';
import { factory, formatFilename } from 'common-common/src/logging';
import { DB } from '../database';
import { AppError, ServerError } from '../util/errors';

const log = factory.getLogger(formatFilename(__filename));
const selectAddress = async (models: DB, req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError('Not logged in'));
  if (!req.body.address) return next(new AppError('Must provide address'));
  if (!req.body.chain) return next(new AppError('Must provide chain'));

  // get user's addresses
  // @ts-ignore
  const addresses = await req.user.getAddresses();
  const newSelectedAddress = addresses.filter((addr) => {
    return addr.chain === req.body.chain && addr.address === req.body.address && !!addr.verified;
  });
  if (newSelectedAddress.length === 0) {
    return next(new AppError('Invalid address'));
  }

  // set other addresses to unselected
  const prevSelectedAddresses = addresses.filter((addr) => {
    return addr.selected && (addr.chain !== req.body.chain || addr.address !== req.body.address);
  });
  for (const prevSelectedAddress of prevSelectedAddresses) {
    prevSelectedAddress.selected = false;
    await prevSelectedAddress.save();
  }

  // set this address to selected
  newSelectedAddress[0].selected = true;
  await newSelectedAddress[0].save();

  return res.json({ status: 'Success', result: { id: newSelectedAddress[0].id } });
};

export default selectAddress;
