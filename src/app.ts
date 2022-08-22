import express, { Express } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import { errorHandler } from './middlewares/errors';
import resourcesController from './controllers/resources.controller';

dotenv.config();
const port = process.env.PORT || 3000;
const app: Express = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/resources', resourcesController);

app.use(errorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});
