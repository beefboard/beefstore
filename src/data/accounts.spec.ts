import * as accounts from './accounts';
import { AuthSession } from './db/db';

describe('login', () => {
  it('should refuse invalid passwords', async () => {
    expect.assertions(1);
    const token = await accounts.login('test', 'fail');

    expect(token).not.toBe(expect.anything());
  });

  it('should refuse invalid accounts', async () => {
    expect.assertions(1);
    const token = await accounts.login('sdfsadf', 'fail');

    expect(token).not.toBe(expect.anything());
  });

  it('should create a token for valid credentials', async () => {
    expect.assertions(1);
    const token = (await accounts.login('test', 'test')) as string;

    expect(token.length).toBeGreaterThan(0);
  });

  it('should accept any case for username', async () => {
    expect.assertions(1);

    const token = await accounts.login('TesT', 'test') as string;

    expect(token.length).toBeGreaterThan(0);
  });
});

describe('logout', async () => {
  it('should allow session to be deleted', async () => {
    expect.assertions(2);

    const token = await accounts.login('test', 'test') as string;

    if (!token) {
      throw Error('Could not get token');
    }

    expect(await accounts.logout(token)).toBeTruthy();
    expect(await accounts.getSession(token)).not.toBe(expect.anything());
  });
});

describe('session', async () => {
  it('should return session from token', async () => {
    expect.assertions(1);
    const token = await accounts.login('test', 'test') as string;
    if (!token) {
      throw Error('Could not get token');
    }

    const session = await accounts.getSession(token);
    expect(session).toBeTruthy();
  });

  it('should store the username in the session', async () => {
    expect.assertions(1);

    const token = await accounts.login('test', 'test');
    if (!token) {
      throw Error('Could not get token');
    }

    const session = await accounts.getSession(token);
    if (!session) {
      throw Error('Could not get session from token');
    }

    expect(session.username).toBe('test');
  });
});

describe('registration', () => {
  beforeEach(async () => {
    await accounts.clearUsers();
  });
  it('should allow user registration', async () => {
    expect.assertions(1);
    const user = {
      username: 'test1',
      password: 'test2',
      firstName: 'test5',
      lastName: 'test6'
    };
    await accounts.register(
      user.username,
      user.password,
      user.firstName,
      user.lastName,
      false
    );

    const token = await accounts.login('test1', 'test2') as string;
    expect(token.length).toBeGreaterThan(0);
  });

  it('should expect unique usernames', async () => {
    expect.assertions(2);
    const user1 = {
      username: 'test2',
      password: 'test3',
      firstName: 'test5',
      lastName: 'test6'
    };
    let success = await accounts.register(
      user1.username,
      user1.password,
      user1.firstName,
      user1.lastName,
      false
    );

    expect(success).toBe(true);

    const user2 = {
      username: 'test2',
      password: 'test3',
      firstName: 'test5',
      lastName: 'test6'
    };
    success = await accounts.register(
      user2.username,
      user2.password,
      user2.firstName,
      user2.lastName,
      false
    );
    expect(success).toBe(false);
  });

  it('should ignore username case', async () => {
    expect.assertions(1);
    const user = {
      username: 'lOweRCase',
      password: 'test2',
      firstName: 'test5',
      lastName: 'test6'
    };
    await accounts.register(
      user.username,
      user.password,
      user.firstName,
      user.lastName,
      false
    );

    const token = await accounts.login('lowercase', 'test2') as string;
    expect(token).not.toBe(null);
  });
});
