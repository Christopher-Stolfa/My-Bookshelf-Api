const express = require('express');
const { randomQuote } = require('../controllers/quoteController');
const { GET_RANDOM_QUOTE } = require('../constants/quotesRoutes.js');
const router = express.Router();

router.get(GET_RANDOM_QUOTE, randomQuote);

module.exports = router;
