import decoder from './decoder';
import restify from 'restify';

describe('token decoder', () => {
  it('decodes token from request header', (done) => {
    expect;
    const token = 'asdfasdf';
    const req = {
      headers: {
        'x-access-token': token
      }
    };
    decoder(req, null, () => {
      expect(req);
    }       as);
  });
});
