const express = require("express");
const router = express.Router();
const booksControllers = require("../Controllers/books.controllers");

router.get("/search-book", booksControllers.bookSearch);

module.exports = router;
