const express = require('express');
const { randomQuote } = require('../Controllers/quotes.controllers.js');
const { GET_RANDOM_QUOTE } = require('../Constants/quotesRoutes.js');
const router = express.Router();

router.get(GET_RANDOM_QUOTE, randomQuote);

module.exports = router;
