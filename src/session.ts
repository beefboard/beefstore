import { Request, Response, NextFunction } from 'express';
import * as account from './data/account';

export async function decoder(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-access-token'] as string;

  if (token != null) {
    req.session = await account.getSession(token);
  }

  next();
}
