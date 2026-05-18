const redis = require('redis');
const logger = require('../utils/logger');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        logger.warn('Max Redis connection retries reached. Running without Redis cache.');
        return false;
      }
      return 1000;
    }
  }
});

const pubClient = redisClient.duplicate();
const subClient = redisClient.duplicate();

redisClient.on('error', (err) => {
  if (err.code !== 'ECONNREFUSED') {
    logger.error('Redis Client Error', err);
  }
});

pubClient.on('error', (err) => {
  if (err.code !== 'ECONNREFUSED') {
    logger.error('Redis Pub Client Error', err);
  }
});

subClient.on('error', (err) => {
  if (err.code !== 'ECONNREFUSED') {
    logger.error('Redis Sub Client Error', err);
  }
});

redisClient.on('connect', () => logger.info('Redis Client Connected'));
pubClient.on('connect', () => logger.info('Redis Pub Client Connected'));
subClient.on('connect', () => logger.info('Redis Sub Client Connected'));

module.exports = {
  redisClient,
  pubClient,
  subClient
};
