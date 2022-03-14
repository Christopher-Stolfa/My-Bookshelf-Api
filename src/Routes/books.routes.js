const express = require('express');
const {
  SEARCH_BOOK,
  SEARCH_BOOK_BY_ID,
  SAVE_FAVORITED_BOOK,
  REMOVED_FAVORITED_BOOK,
  GET_FAVORITED_BOOKS,
  GET_FAVORITED_BOOK,
  TOGGLE_READING_BOOK,
  SET_BOOK_PROGRESS,
  SAVE_NOTE,
  EDIT_NOTE,
  DELETE_NOTE,
  GET_NOTES,
} = require('../Constants/booksRoutes.js');
const {
  bookSearch,
  bookSearchById,
  getUserFavorites,
  getFavoritedBook,
  saveFavoritedBook,
  removeFavoritedBook,
  saveNote,
  editNote,
  deleteNote,
  getNotes,
  toggleReadingBook,
  setBookProgress,
} = require('../Controllers/books.controllers.js');
const router = express.Router();

router.get(SEARCH_BOOK, bookSearch);
router.get(SEARCH_BOOK_BY_ID, bookSearchById);

router.post(SAVE_FAVORITED_BOOK, saveFavoritedBook);
router.delete(REMOVED_FAVORITED_BOOK, removeFavoritedBook);
router.get(GET_FAVORITED_BOOKS, getUserFavorites);
router.get(GET_FAVORITED_BOOK, getFavoritedBook);
router.put(TOGGLE_READING_BOOK, toggleReadingBook);
router.put(SET_BOOK_PROGRESS, setBookProgress);

router.post(SAVE_NOTE, saveNote);
router.put(EDIT_NOTE, editNote);
router.delete(DELETE_NOTE, deleteNote);
router.get(GET_NOTES, getNotes);

module.exports = router;
