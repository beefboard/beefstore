import express from 'express';
import bodyParser from 'body-parser';
import v1 from './routes/v1';

const app = express();

// Parse any body
app.use(bodyParser.json());

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

export default app;
