/**
 * @description - all routes used by bookRouter
 * @module constants/booksRoutes
 */
/**
 * @type {string}
 */
const SEARCH_BOOK = '/search-book';
/**
 * @type {string}
 */
const SEARCH_BOOK_BY_ID = '/search-book-by-id';
/**
 * @type {string}
 */
const SAVE_FAVORITED_BOOK = '/save-favorited-book';
/**
 * @type {string}
 */
const REMOVED_FAVORITED_BOOK = '/remove-favorited-book';
/**
 * @type {string}
 */
const GET_FAVORITED_BOOKS = '/get-favorited-books';
/**
 * @type {string}
 */
const GET_FAVORITED_BOOK = '/get-favorited-book';
/**
 * @type {string}
 */
const TOGGLE_READING_BOOK = '/toggle-reading-book';
/**
 * @type {string}
 */
const SET_BOOK_PROGRESS = '/set-book-progress';
/**
 * @type {string}
 */
const SAVE_NOTE = '/save-note';
/**
 * @type {string}
 */
const EDIT_NOTE = '/edit-note';
/**
 * @type {string}
 */
const DELETE_NOTE = '/delete-note';
/**
 * @type {string}
 */
const GET_NOTES = '/get-notes';

module.exports = {
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
};
