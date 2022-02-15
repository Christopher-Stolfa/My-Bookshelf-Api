const express = require("express");
const router = express.Router();
const quotesControllers = require("../Controllers/quotes.controllers");
const { GET_RANDOM_QUOTE } = require("../Constants/quotesRoutes");

router.get(GET_RANDOM_QUOTE, quotesControllers.randomQoute);

module.exports = router;
