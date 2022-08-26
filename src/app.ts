import express, { Express } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import { errorHandler } from './middlewares/errors';
import itemsController from './controllers/items.controller';

dotenv.config();
const port = process.env.PORT || 3000;
const app: Express = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/resources', itemsController);

app.use(errorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});
