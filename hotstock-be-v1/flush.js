const Redis = require('ioredis');
const redis = new Redis({
  host: 'localhost',
  port: 6379,
  password: 'password'
});
redis.flushall().then(() => {
  console.log('Flushed Redis');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
