import * as session from './session';
import * as account from './data/account';

import { Response } from 'express';

describe('token decoder', () => {
  it('decodes token from request header', async (done) => {
    expect.assertions(1);

    const token = await account.login('test', 'test');
    const req = {
      headers: {
        'x-access-token': token
      },
      token: null
    } as any;

    session.decoder(req, {} as Response, (() => {
      expect(req.session).not.toBe(null);
      done();
    }));
  });
});
