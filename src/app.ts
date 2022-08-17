import { createClient } from 'redis';

const client = createClient({
  password: 'mysecretpassword',
});

(async () => {
  // eslint-disable-next-line no-console
  client.on('error', (err) => console.log('Redis Error', err));

  await client.connect();

  for (let i = 0; i < 50000000; i++) {
    if (i % 1000 === 0) {
      // eslint-disable-next-line no-console
      console.log(i);
      await client.set(`bkey${i}`, Math.random() * 100000000);
    } else {
      client.set(`bkey${i}`, Math.random() * 100000000);
    }

    // const value = await client.get(`akey${i}`);
    // // eslint-disable-next-line no-console
    // console.log(value);
  }
})();
