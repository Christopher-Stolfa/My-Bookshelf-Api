const express = require("express");
const router = express.Router();
const booksControllers = require("../Controllers/books.controllers");
const rateLimiter = require("../Middleware/rateLimiter");

router.use(rateLimiter);
router.get("/search-book", booksControllers.bookSearch);

module.exports = router;
