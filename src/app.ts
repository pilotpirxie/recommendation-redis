import { createClient } from 'redis';

const client = createClient({
  password: 'mysecretpassword',
});

(async () => {
  // eslint-disable-next-line no-console
  client.on('error', (err) => console.log('Redis Error', err));

  await client.connect();

  // for (let i = 0; i < 1000; i++) {
  //   if (i % 100000 === 0) {
  //     // eslint-disable-next-line no-console
  //     console.log(i);
  //     await client.set(`bkey${i}`, Math.random() * 100000000);
  //   } else {
  //     client.set(`bkey${i}`, Math.random() * 100000000);
  //   }
  // }

  for await (const key of client.scanIterator({ MATCH: 'bkey5?' })) {
    const v = await client.get(key);
    console.log(key, v);
  }
})();
