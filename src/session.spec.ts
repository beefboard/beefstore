import * as session from './session';
import * as accounts from './data/accounts';

import { Response } from 'express';
import { initDb } from './data/db/db';

beforeAll(async () => {
  await initDb();
});

class MockResponse {
  public data: any;
  public responseStatus: number = -1;

  public status(code: number) {
    this.responseStatus = code;
    return this;
  }

  public send(data: any) {
    this.data = data;
  }
}

describe('decoder', () => {
  it('should decode session from token in request header', async (done) => {
    expect.assertions(1);

    const token = await accounts.login('test', 'test');
    const req = {
      headers: {
        'x-access-token': token
      }
    } as any;

    await session.decoder(req, {} as Response, (() => {
      expect(req.session).not.toBeNull();
      done();
    }));
  });

  it('should not decode session from bad tokens', async (done) => {
    expect.assertions(1);

    const token = 'this-is-bad';

    const req = {
      headers: {
        'x-access-token': token
      }
    } as any;

    await session.decoder(req, {} as Response, () => {
      expect(req.session).toBeUndefined();
      done();
    });
  });
});

describe('guard', () => {
  it('should send 401 when session is defined', () => {
    expect.assertions(2);
    const expectedData = {
      error: 'Unauthorised'
    };

    const testRes = new MockResponse() as any;

    const req = {
      session: null
    } as any;

    session.guard(req, testRes, () => {});
    expect(testRes.responseStatus).toBe(401);
    expect(testRes.data).toMatchObject(expectedData);
  });

  it('should call next when session has username', () => {
    expect.assertions(1);

    const req = {
      session: {
        username: 'test'
      }
    };

    const next = jest.fn();

    session.guard(req as any, null as any, next);
    expect(next).toBeCalled();
  });
});

describe('admin guard', () => {
  it('should send 403 when session not admin', () => {
    expect.assertions(2);
    const expectedData = {
      error: 'Forbidden'
    };

    const testRes = new MockResponse() as any;

    const req = {
      session: {
        username: 'test',
        admin: false
      }
    } as any;

    session.adminGuard(req, testRes, () => {});
    expect(testRes.responseStatus).toBe(403);
    expect(testRes.data).toMatchObject(expectedData);
  });

  it('should call next when session is admin', () => {
    expect.assertions(1);

    const req = {
      session: {
        username: 'test',
        admin: true
      }
    };

    const next = jest.fn();

    session.adminGuard(req as any, null as any, next);
    expect(next).toBeCalled();
  });
});
