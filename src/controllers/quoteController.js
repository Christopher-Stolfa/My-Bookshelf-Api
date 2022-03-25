/**
 * @description - Controller functions for handling api requests regarding quotes
 * @module controllers/quoteController
 */
const { getRandomQuote } = require('../services/quoteService');

/**
 * @description - Gets a random inspirational quote
 * @function randomQuote
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const randomQuote = (req, res, next) => {
  try {
    const quote = getRandomQuote();
    res.status(200).json({
      message: 'Quote found success',
      selectedQuote: quote,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { randomQuote };
