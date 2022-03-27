/**
 * @description - Book services used by the controller for business logic involving database models
 * @module services/bookService
 * @see module:controllers/bookController
 */
const { User, Note, FavoritedBook } = require('../database/models');

/**
 * @description - A book object
 * @typedef {Object} Book
 * @property {number} Book.googleBooksId - The id used by the google books api
 * @property {string} Book.title - The book title
 * @property {string} Book.description - The book description
 * @property {Array} Book.authors - Authors associated with the book
 * @property {string} Book.publisher - Publisher associated with the book
 * @property {string} Book.publishedDate - Date the book was published
 * @property {number} Book.pageCount - Amount of pages in the book
 * @property {number} Book.averageRating - Google books api average rating
 * @property {number} Book.ratingsCount - Google books api ratings count
 * @property {string} Book.imageLink - Thumbnail for the book provided by google books api
 * @property {string} Book.language - Language of the book
 * @property {Array} Book.categories - Categories the book belongs to
 */

/**
 * @description - Creates a FavoritedBook with a userId foreign key
 * @function dbSaveFavoritedBook
 * @param {number} userId - Id of the user from their current session
 * @param {Book} book - The book data
 * @throws {error} - Throws an error if the user isn't found, the book isn't saved, or if something goes wrong within the model or database itself
 * @returns {Object} - Returns an object with the book data that was just saved
 */
const dbSaveFavoritedBook = async (userId, book) => {
  const user = await User.findOne({ where: { userId } });
  if (!user) throw { message: 'Error saving book', code: 403 };
  const favoriteBook = await user.createFavoritedBook({
    googleBooksId: book.googleBooksId,
    title: book.title,
    description: book.description,
    authors: book.authors,
    publisher: book.publisher,
    publishedDate: book.publishedDate,
    pageCount: book.pageCount,
    averageRating: book.averageRating,
    ratingsCount: book.ratingsCount,
    imageLink: book.imageLink,
    language: book.language,
    categories: book.categories,
    isReading: false,
    progress: 0,
  });
  if (!favoriteBook) throw { message: 'Error saving book', code: 403 };
  return favoriteBook;
};

/**
 * @todo - Use favoritedBookId instead of using the entire book object
 * @description - Removes a FavoritedBook with a userId foreign key
 * @function dbRemoveFavoritedBook
 * @param {number} userId - Id of the user from their current session
 * @param {Book} book - The book data
 * @throws {error} - Throws an error if the user isn't found, the book isn't removed, or if something goes wrong within the model or database itself
 * @returns {Object} - Returns an object with the book data that was just saved
 */
const dbRemoveFavoritedBook = async (userId, book) => {
  const user = await User.findOne({ where: { userId } });
  if (!user) throw { message: 'Error removing book', code: 403 };
  const removedBook = await FavoritedBook.destroy({
    where: { googleBooksId: book.googleBooksId, userId: user.userId },
  });
  if (!removedBook) throw { message: 'Error removing book', code: 403 };
  return removedBook;
};

/**
 * @todo - Use favoritedBookId instead of using the entire book object
 * @description - Gets a FavoritedBook by bookId with a userId foreign key
 * @function dbGetFavoritedBook
 * @param {number} userId - Id of the user from their current session
 * @param {number} bookId - Id of the book
 * @throws {error} - Throws an error if the user isn't found, the book isn't found, or if something goes wrong within the model or database itself
 * @returns {Object} - Returns an object with the book data that was just saved
 */
const dbGetFavoritedBook = async (userId, googleBooksId) => {
  const book = await FavoritedBook.findOne({
    where: { userId, googleBooksId },
  });
  if (!book) throw { message: "Book doesn't exist", code: 404 };
  return book;
};

/**
 * @description - Gets an array of a user's favorited books
 * @function dbGetFavoritedBooks
 * @param {number} userId - Id of the user requesting their favorites
 * @throws - Throws an error if the user isn't found
 * @returns {Array} - Returns an array of the user's favorite books
 */
const dbGetFavoritedBooks = async (userId) => {
  const user = await User.findOne({ where: { userId } });
  if (!user) throw { message: 'Cannot get favorites', code: 400 };
  const favoritedBooks = await user.getFavoritedBooks();
  return favoritedBooks;
};

/**
 * @todo - Change this method so it uses favoritedBookId instead of googleBooksId
 * @description - Updates a users favorited book isReading and progress property
 * @function dbToggleReadingBook
 * @param {number} userId
 * @param {string} googleBooksId
 * @param {boolean} isReading
 * @param {number} progress
 * @throws - Throws an error if the book is not in the user's favorites
 * @returns {Object} - The updated favorite book
 */
const dbToggleReadingBook = async (userId, googleBooksId, isReading, progress) => {
  const favoritedBook = await FavoritedBook.findOne({
    where: { userId, googleBooksId },
  });
  if (!favoritedBook) throw { message: 'Book must be in your favorites', code: 400 };
  const bookData = await favoritedBook.update({ isReading, progress });
  bookData.progress = parseInt(bookData.progress);
  return bookData;
};

/**
 * @todo - Change this method so it uses favoritedBookId instead of googleBooksId
 * @description - Sets the reading progress of the favorited book
 * @function dbSetBookProgress
 * @param {number} userId
 * @param {string} googleBooksId
 * @param {number} progress
 * @throws - Throws an error if the book is not in the user's favorites
 * @returns {Object}  - The updated favorite book
 */
const dbSetBookProgress = async (userId, googleBooksId, progress) => {
  const favoritedBook = await FavoritedBook.findOne({
    where: { userId, googleBooksId },
  });
  if (!favoritedBook) throw { message: 'Book must be in your favorites', code: 400 };
  const bookData = await favoritedBook.update({ progress });
  bookData.progress = parseInt(bookData.progress);
  return bookData;
};

/**
 * @todo - Change this method so it uses favoritedBookId instead of googleBooksId this way we don't need userId
 * @description - Saves a note associated with a favorited book
 * @function dbSaveNote
 * @param {number} userId
 * @param {string} googleBooksId
 * @param {string} text
 * @returns {Object} - Returns a note object
 */
const dbSaveNote = async (userId, googleBooksId, text) => {
  const favoritedBook = await FavoritedBook.findOne({
    where: { userId, googleBooksId },
  });
  if (!favoritedBook) throw { message: 'Book must be in your favorites', code: 400 };
  const note = await favoritedBook.createNote({ text });
  if (!note) throw { message: 'Error saving note' };
  return note;
};

/**
 * @todo - We no longer need to use userId, change this where it's called in the controller as well as the payload in the frontend
 * @description - Edits a note associated with a favorited book
 * @function dbEditNote
 * @param {number} userId - DEPRECATING USE OF userId
 * @param {number} noteId
 * @param {string} text
 * @throw - Throws an error if the note isn't found
 * @returns {Object} - Returns the updated note object
 */
const dbEditNote = async (userId, noteId, text) => {
  const note = await Note.findOne({ where: { noteId } });
  if (!note) throw { message: 'Error saving note' };
  const updatedNote = await note.update({ text });
  if (!note) throw { message: 'Error saving note' };
  return updatedNote;
};

/**
 * @todo - We no longer need to use userId, change this where it's called in the controller as well as the payload in the frontend
 * @description - Deletes a note by noteId associated with a favoritedBook
 * @param {number} userId
 * @param {number} noteId
 * @throws - Throws an error if the note doesn't exist or fails to get deleted
 */
const dbDeleteNote = async (userId, noteId) => {
  const note = await Note.findOne({ where: { noteId } });
  if (!note) throw { message: 'Error deleting note' };
  await note.destroy();
};

/**
 * @todo - Use favoritedBookId instead of googleBooksId so that the userId is no longer needed
 * @description - Gets all notes associated with a favoritedBook which is associated with a user
 * @param {number} userId
 * @param {string} googleBooksId
 * @returns {Array} - Returns an array of notes
 */
const dbGetNotes = async (userId, googleBooksId) => {
  const favoritedBook = await FavoritedBook.findOne({
    where: { userId, googleBooksId },
  });
  if (!favoritedBook) throw { message: 'Book must be in your favorites' };
  const notes = await favoritedBook.getNotes();
  return notes;
};

module.exports = {
  dbGetFavoritedBook,
  dbSaveFavoritedBook,
  dbRemoveFavoritedBook,
  dbGetFavoritedBooks,
  dbSaveNote,
  dbEditNote,
  dbDeleteNote,
  dbGetNotes,
  dbToggleReadingBook,
  dbSetBookProgress,
};
