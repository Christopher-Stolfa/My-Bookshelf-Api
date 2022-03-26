/**
 * @description - Router that handles api methods for quotes
 * @module routes/quoteRouter
 */
const express = require('express');
const { randomQuote } = require('../controllers/quoteController');
const { GET_RANDOM_QUOTE } = require('../constants/quotesRoutes.js');

/**
 * @description - Express router for mounting book related functions
 * @type {object}
 */
const router = express.Router();

/**
 * @description - Route for getting a random inspirational quote
 * @function
 * @param {string} path - Express path
 * @param {callback} randomQuote - Controller/express middleware
 */
router.get(GET_RANDOM_QUOTE, randomQuote);

module.exports = router;
