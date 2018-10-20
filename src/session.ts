import { Request, Response, NextFunction } from 'express';
import * as account from './data/account';

export async function decoder(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-access-token'] as string;

  if (token != null) {
    req.session = await account.getSession(token);
  }

  next();
}

export async function guard(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.username) {
    return next();
  }

  res.status(401).send({
    error: 'Unauthorised'
  });
}

export async function adminGuard(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.admin) {
    return next();
  }

  res.status(403).send({
    error: 'Forbidden'
  });
}
