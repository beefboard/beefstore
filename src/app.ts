import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import routes from './routes';

const app = express();

app.use(morgan('tiny'));

// Parse any body
app.use(bodyParser.json());
app.use(routes);

export default app;
