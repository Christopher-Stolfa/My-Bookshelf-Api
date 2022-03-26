/**
 * @description - Router that handles api methods for books
 * @module routes/bookRouter
 * @see module:constants/booksRoutes
 * @see module:controllers/bookController
 */
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
} = require('../constants/booksRoutes');
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
} = require('../controllers/bookController');

/**
 * @description - Express router for mounting book controller methods
 * @property {Function} get
 * @property {Function} post
 * @property {Function} put
 * @property {Function} delete
 */
const router = express.Router();

/**
 * @description - Route for searching books
 * @function
 * @param {string} path - Express path
 * @param {callback} bookSearch - Controller/express middleware
 */
router.get(SEARCH_BOOK, bookSearch);

/**
 * @description - Route for searching a book by id
 * @function
 * @param {string} path - Express path
 * @param {callback} bookSearchById - Controller/express middleware
 */
router.get(SEARCH_BOOK_BY_ID, bookSearchById);

/**
 * @description - Route for saving a book to the user's favorites
 * @function
 * @param {string} path - Express path
 * @param {callback} saveFavoritedBook - Controller/express middleware
 */
router.post(SAVE_FAVORITED_BOOK, saveFavoritedBook);

/**
 * @description - Route for removing a book from the user's favorites
 * @function
 * @param {string} path - Express path
 * @param {callback} removeFavoritedBook - Controller/express middleware
 */
router.delete(REMOVED_FAVORITED_BOOK, removeFavoritedBook);

/**
 * @description - Route for getting all of a user's favorite books
 * @function
 * @param {string} path - Express path
 * @param {callback} getUserFavorites - Controller/express middleware
 */
router.get(GET_FAVORITED_BOOKS, getUserFavorites);

/**
 * @description - Route for getting a user's favorite book by id
 * @function
 * @param {string} path - Express path
 * @param {callback} getFavoritedBook - Controller/express middleware
 */
router.get(GET_FAVORITED_BOOK, getFavoritedBook);

/**
 * @description - Route for toggling whether or not a user is currently reading a book
 * @function
 * @param {string} path - Express path
 * @param {callback} toggleReadingBook - Controller/express middleware
 */
router.put(TOGGLE_READING_BOOK, toggleReadingBook);

/**
 * @description - Route for setting the progress of a book
 * @function
 * @param {string} path - Express path
 * @param {callback} setBookProgress - Controller/express middleware
 */
router.put(SET_BOOK_PROGRESS, setBookProgress);

/**
 * @description - Route for saving a note associated with a favorited book
 * @function
 * @param {string} path - Express path
 * @param {callback} saveNote - Controller/express middleware
 */
router.post(SAVE_NOTE, saveNote);

/**
 * @description - Route for editing an existing note associated with a favorited book
 * @function
 * @param {string} path - Express path
 * @param {callback} editNote - Controller/express middleware
 */
router.put(EDIT_NOTE, editNote);

/**
 * @description - Route for deleting an existing note associated with a favorited book
 * @function
 * @param {string} path - Express path
 * @param {callback} deleteNote - Controller/express middleware
 */
router.delete(DELETE_NOTE, deleteNote);

/**
 * @description - Route for getting all notes associated with a favorited book
 * @function
 * @param {string} path - Express path
 * @param {callback} getNotes - Controller/express middleware
 */
router.get(GET_NOTES, getNotes);

module.exports = router;
