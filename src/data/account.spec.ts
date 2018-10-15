import * as account from './account';

describe('login', () => {
  it('should refuse invalid credentials', async () => {
    expect.assertions(1);
    const token = await account.login('test', 'fail');

    expect(token).toBe(null);
  });
});
