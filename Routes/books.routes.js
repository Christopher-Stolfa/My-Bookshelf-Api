const express = require("express");
const router = express.Router();
const {
  bookSearch,
  bookSearchById,
  getUserFavorites,
  saveFavoritedBook,
  removeFavoritedBook,
} = require("../Controllers/books.controllers");
const {
  SEARCH_BOOK,
  SEARCH_BOOK_BY_ID,
  SAVE_FAVORITED_BOOK,
  REMOVED_FAVORITED_BOOK,
  GET_FAVORITED_BOOKS,
} = require("../Constants/booksRoutes");

router.get(SEARCH_BOOK, bookSearch);
router.get(SEARCH_BOOK_BY_ID, bookSearchById);

router.post(SAVE_FAVORITED_BOOK, saveFavoritedBook);
router.delete(REMOVED_FAVORITED_BOOK, removeFavoritedBook);
router.get(GET_FAVORITED_BOOKS, getUserFavorites);

module.exports = router;
