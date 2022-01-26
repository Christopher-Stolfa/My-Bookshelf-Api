const express = require("express");
const router = express.Router();
const {
  bookSearch,
  bookSearchById,
} = require("../Controllers/books.controllers");
const { SEARCH_BOOK, SEARCH_BOOK_BY_ID } = require("../Constants/booksRoutes");

router.get(SEARCH_BOOK, bookSearch);
router.get(SEARCH_BOOK_BY_ID, bookSearchById);

module.exports = router;
