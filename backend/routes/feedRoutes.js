const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const { body } = require('express-validator');

router.get('/feed', feedController.getFeeds);

router.post(
  '/feed', 
  [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    body('message')
      .trim()
      .notEmpty().withMessage('Message is required')
      .isLength({ min: 5, max: 500 }).withMessage('Message must be between 5 and 500 characters')
  ],
  feedController.createFeed
);

module.exports = router;
