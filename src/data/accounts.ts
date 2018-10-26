import * as db from './db/db';
import bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import moment from 'moment';

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
    let token;

    // Create a token from a v4 uuid, if the uuid exists, try again.
    while (true) {
      token = uuid.v4();
      const exists = await db.getSession(token);
      if (!exists) {
        await db.storeSession(token, username.toLowerCase(), moment().add(2, 'weeks').toDate());
        break;
      }
    }

    return token;
  }

  return null;
}

export async function register(
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  admin: boolean): Promise<boolean> {

  const user: db.User = {
    username: username.toLowerCase(),
    passwordHash: await bcrypt.hash(password, 10),
    firstName: firstName,
    lastName: lastName,
    admin: admin
  };

  const success = await db.saveUser(user);
  return success;
}

export async function getSession(token: string): Promise<db.AuthSession | null> {
  const session = await db.getSession(token);

  // If the session exists, and the session has not expiered extend the session
  if (session) {
    if (session.expiration > moment().toDate()) {
      const [details , _] = await Promise.all([
        db.getDetails(session.username),
        db.storeSession(token, session.username, moment().add(2, 'weeks').toDate())
      ]);

      if (details) {
        return {
          username: details.username.toLowerCase(),
          firstName: details.firstName,
          lastName: details.lastName,
          admin: details.admin,
          token: token
        };
      }
    } else {
      // TODO: Delete session as expired
    }
  }
  return null;
}

export async function clearUsers() {
  await db.clearUsers();
  await db.generateInitialUsers();
}

export async function logout(token: string): Promise<boolean> {
  return await db.removeSession(token);
}
/**
 * Remove expired sessions every 60 seconds
 */
async function removeOldSessionLoop() {
  while (true) {
    try {
      await db.removeSessions(new Date());
    } catch (e) {}
    await new Promise((resolve) => {
      setTimeout(resolve, 60000);
    });
  }
}

removeOldSessionLoop();
