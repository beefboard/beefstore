import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();

// Parse any body
app.use(bodyParser.json());
app.use(routes);

export default app;
