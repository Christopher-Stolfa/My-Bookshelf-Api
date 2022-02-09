const express = require("express");
const router = express.Router();
const quotesControllers = require("../Controllers/quotes.controllers");
const { GET_RANDOM_QOUTE } = require("../Constants/quotesRoutes");

router.get(GET_RANDOM_QOUTE, quotesControllers.randomQoute);

module.exports = router;
