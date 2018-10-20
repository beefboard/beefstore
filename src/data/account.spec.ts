import * as account from './account';

describe('login', () => {
  it('should refuse invalid passwords', async () => {
    expect.assertions(1);
    const token = await account.login('test', 'fail');

    expect(token).not.toBe(expect.anything());
  });

  it('should refuse invalid accounts', async () => {
    expect.assertions(1);
    const token = await account.login('sdfsadf', 'fail');

    expect(token).not.toBe(expect.anything());
  });

  it('should create a token for valid credentials', async () => {
    expect.assertions(1);
    const token = (await account.login('test', 'test')) as string;

    expect(token.length).toBeGreaterThan(0);
  });

  it('should accept any case for username', async () => {
    expect.assertions(1);

    const token = await account.login('TesT', 'test') as string;

    expect(token.length).toBeGreaterThan(0);
  });
});

describe('session', async () => {
  it('should return session from token', async () => {
    expect.assertions(1);
    const token = await account.login('test', 'test') as string;
    if (!token) {
      throw Error('Could not get token');
    }

    const session = await account.getSession(token);
    expect(session).toBeTruthy();
  });

  it('should store the username in the session', async () => {
    expect.assertions(1);

    const token = await account.login('test', 'test');
    if (!token) {
      throw Error('Could not get token');
    }

    const session = await account.getSession(token);
    if (!session) {
      throw Error('Could not get session from token');
    }

    expect(session.username).toBe('test');
  });
});
