declare global {
  namespace Express {
    interface Request {
      session: AuthSession | null;
    }
  }
}

import express from 'express';
import bodyParser from 'body-parser';
import * as session from './session';
import { AuthSession, initDb } from './data/db/db';
import v1 from './routes/v1';

const app = express();

app.use(bodyParser.json());
app.use(session.decoder);

app.use('/v1', v1);

app.get('/', (_, res) => {
  res.send({
    v1: '/v1'
  });
});

app.use((_, res) => {
  res.status(404).send({
    error: 'Not found'
  });
});

app.listen(2832, async () => {
  console.log('Listening on 2832');
  try {
    await initDb();
  } catch (e) {
    console.error(`Could not initialise database: ${e.message}`);
  }
});
