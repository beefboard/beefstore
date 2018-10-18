import * as account from './account';

describe('account', () => {
  it('should refuse invalid credentials', async () => {
    expect.assertions(1);
    const token = await account.login('test', 'fail');

    expect(token).toBe(null);
  });

  it('should create a token for valid credentials', async () => {
    expect.assertions(1);
    const token = await account.login('test', 'test');

    expect(token).not.toBe(null);
  });

  it('should access any case for username', async () => {
    expect.assertions(1);

    const token = await account.login('TesT', 'test');

    expect(token).not.toBe(null);
  });

  it('should be able to verify valid tokens', async () => {
    expect.assertions(1);
    const token = await account.login('test', 'test');
    if (!token) {
      throw Error('Could not get token');
    }

    const session = await account.getSession(token);
    expect(session).not.toBe(null);
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
