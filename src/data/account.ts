import * as db from './db/db';
import bcrypt, { hash } from 'bcrypt';
import * as uuid from 'uuid';

async function genHash(password: string) {
  return bcrypt.hash(password, 10);
}

/**
 * Login to the account, returning the auth token
 */
export async function login(username: string, password: string): Promise<string | null> {
  const hashedPass = await db.getPassword(username.toLowerCase());

  if (!hashedPass) {
    return null;
  }

  if (await bcrypt.compare(password, hashedPass)) {
    // The credentials are valid
    const token = uuid.v1();
    db.saveSession(token, username.toLowerCase());

    return token;
  }

  return null;
}

export async function getSession(token: string): Promise<db.AuthSession | null> {
  return await db.getSession(token);
}
