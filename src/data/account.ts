import * as db from './db/db';
import bcrypt, { hash } from 'bcrypt';
import * as uuid from 'uuid';
import moment from 'moment';

async function genHash(password: string) {
  return bcrypt.hash(password, 10);
}

/**
 * Login to the account, returning the auth token
 */
export async function login(username: string, password: string): Promise<string | null> {
  const userDetails = await db.getDetails(username.toLowerCase());

  if (!userDetails) {
    return null;
  }

  if (await bcrypt.compare(password, userDetails.passwordHash)) {
    // The credentials are valid
    const token = uuid.v1();
    await db.storeSession(token, username.toLowerCase(), moment().add(2, 'weeks').toDate());

    return token;
  }

  return null;
}

export async function register(
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  admin: boolean) {

}

export async function getSession(token: string): Promise<db.AuthSession | null> {
  const session = await db.getSession(token);

  // If the session exists, and the session has not experied extend the session
  if (session) {
    if (session.expiration > moment().toDate()) {
      const [details , _] = await Promise.all([
        db.getDetails(session.username),
        db.storeSession(token, session.username, moment().add(2, 'weeks').toDate())
      ]);

      if (details) {
        return {
          username: details.username,
          firstName: details.firstName,
          lastName: details.lastName,
          admin: details.admin
        };
      }
    } else {
      // TODO: Delete session as expired
    }
  }
  return null;
}
