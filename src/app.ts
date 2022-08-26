import express, { Express } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import { createClient, RedisClientType } from 'redis';
import { errorHandler } from './middlewares/errors';
import { initializeItemsController } from './controllers/items';
import { RedisStorage } from './data/redisStorage';

dotenv.config();
const port = process.env.PORT || 3000;
const app: Express = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const redis = createClient({
  password: 'mysecretpassword',
});

redis.on('connect', () => {
  console.info('Redis connected');
}).on('error', (err) => {
  console.error('Redis error', err);
}).on('end', () => {
  console.info('Redis disconnected');
});

redis.connect();

if (!redis) {
  throw new Error('Redis client not created');
}

const redisStorage = new RedisStorage(redis as RedisClientType);

app.use('/api/items', initializeItemsController(redisStorage));

app.use(errorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});
