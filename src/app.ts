import { createClient } from 'redis';

const client = createClient();

(async () => {
// eslint-disable-next-line no-console
  client.on('error', (err) => console.log('Redis Error', err));

  await client.connect();

  await client.set('key', 'value');
  const value = await client.get('key');

  // eslint-disable-next-line no-console
  console.log(value);
})();
