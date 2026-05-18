const feedService = require('../services/feedService');
const { getIo } = require('../sockets/socketManager');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

const getFeeds = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const feedsData = await feedService.getFeeds(page, limit);
    res.status(200).json(feedsData);
  } catch (error) {
    next(error);
  }
};

const createFeed = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed for feed creation');
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { title, message } = req.body;

    const newFeed = await feedService.createFeed({ title, message });

    const io = getIo();
    if (io) {
      io.emit('newFeed', newFeed);
    }

    res.status(201).json(newFeed);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeeds,
  createFeed
};
