const Feed = require('../models/Feed');
const { redisClient } = require('../config/redis');
const logger = require('../utils/logger');

const getFeeds = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const cacheKey = `feed:page:${page}:limit:${limit}`;

  try {
    try {
      if (redisClient && redisClient.isReady) {
        const cachedFeeds = await redisClient.get(cacheKey);
        if (cachedFeeds) {
          logger.info(`Serving page ${page} from Redis cache`);
          return JSON.parse(cachedFeeds);
        }
      }
    } catch (redisError) {
      logger.warn(`Redis cache failed for getFeeds, bypassing cache: ${redisError.message}`);
    }

    logger.info(`Fetching page ${page} from MongoDB`);
    
    const [feeds, totalItems] = await Promise.all([
      Feed.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Feed.countDocuments()
    ]);

    const formattedFeeds = feeds.map(feed => {
      const { _id, __v, ...rest } = feed;
      return { id: _id.toString(), ...rest };
    });

    const result = {
      feeds: formattedFeeds,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    };

    try {
      if (redisClient && redisClient.isReady) {
        await redisClient.setEx(cacheKey, 60, JSON.stringify(result));
      }
    } catch (redisError) {
    }

    return result;
  } catch (error) {
    logger.error('Error in getFeeds service:', error);
    throw error;
  }
};

const createFeed = async (feedData) => {
  try {
    const newFeed = new Feed(feedData);
    await newFeed.save();
    try {
      if (redisClient && redisClient.isReady) {
        const keys = await redisClient.keys('feed:page:*');
        if (keys.length > 0) {
          await redisClient.del(keys);
          logger.info('Redis cache cleared on new feed creation');
        }
      }
    } catch (redisError) {
      logger.warn(`Failed to clear Redis cache: ${redisError.message}`);
    }

    return newFeed.toJSON();
  } catch (error) {
    logger.error('Error in createFeed service:', error);
    throw error;
  }
};

module.exports = {
  getFeeds,
  createFeed
};
