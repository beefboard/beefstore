import express from 'express';
declare global {
  namespace Express {
    interface Request {
      session: AuthSession | null;
    }
  }
}

import * as session from './session';
import { AuthSession } from './data/db/db';
import v1 from './routes/v1';

const app = express();

app.use(session.decoder);

app.use('/v1', v1);

app.get('/', (req, res) => {
  res.send({
    v1: '/v1'
  });
});

app.use((req, res) => {
  res.status(404).send({
    error: 'Not found'
  });
});

app.listen(2832, () => {
  console.log('Listening on 2832');
});
