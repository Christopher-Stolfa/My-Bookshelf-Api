/**
 * @description - Book services used by the controller for business logic involving database models
 * @module services/bookService
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
 * @description - Gets a FavoritedBook by bookId with a userId foreign key
 * @function dbGetFavoritedBook
 * @param {number} userId - Id of the user from their current session
 * @param {number} bookId - Id of the book
 * @throws {error} - Throws an error if the user isn't found, the book isn't found, or if something goes wrong within the model or database itself
 * @returns {Object} - Returns an object with the book data that was just saved
 */
const dbGetFavoritedBook = (userId, bookId) =>
  FavoritedBook.findOne({
    where: { UserId: userId, GoogleBooksId: bookId },
  }).then((book) => {
    if (!book) {
      throw { message: "Book doesn't exist", code: 404 };
    } else {
      return {
        googleBooksId: book.GoogleBooksId,
        title: book.Title,
        description: book.Description,
        authors: book.Authors,
        publisher: book.Publisher,
        publishedDate: book.PublishedDate,
        pageCount: book.PageCount,
        averageRating: book.AverageRating,
        ratingsCount: book.RatingsCount,
        imageLink: book.ImageLink,
        language: book.Language,
        categories: book.Categories,
        isReading: book.IsReading,
        progress: book.Progress,
      };
    }
  });

const dbGetFavoritedBooks = (userId) =>
  User.findOne({ where: { UserId: userId } }).then(
    (user) =>
      user &&
      user.getFavoritedBooks().then((books) =>
        books.map((book) => ({
          googleBooksId: book.GoogleBooksId,
          title: book.Title,
          description: book.Description,
          authors: book.Authors,
          publisher: book.Publisher,
          publishedDate: book.PublishedDate,
          pageCount: book.PageCount,
          averageRating: book.AverageRating,
          ratingsCount: book.RatingsCount,
          imageLink: book.ImageLink,
          language: book.Language,
          categories: book.Categories,
          isReading: book.IsReading,
          progress: book.Progress,
        }))
      )
  );

const dbToggleReadingBook = (userId, googleBooksId, isReading, progress) =>
  FavoritedBook.findOne({
    where: { UserId: userId, GoogleBooksId: googleBooksId },
  })
    .then((favoritedBook) => {
      if (favoritedBook) {
        return favoritedBook.update({ IsReading: isReading, Progress: progress }).then((book) => ({
          isReading: book.IsReading,
          progress: parseInt(book.Progress),
        }));
      } else {
        throw { message: 'Book must be saved as a favorite', code: 400 };
      }
    })
    .catch((error) => {
      throw error;
    });

const dbSetBookProgress = (userId, googleBooksId, progress) =>
  FavoritedBook.findOne({
    where: { UserId: userId, GoogleBooksId: googleBooksId },
  })
    .then((favoritedBook) => {
      if (favoritedBook) {
        return favoritedBook.update({ Progress: progress }).then((book) => ({
          progress: parseInt(book.Progress),
        }));
      } else {
        throw { message: 'Book must be saved as a favorite', code: 400 };
      }
    })
    .catch((error) => {
      throw error;
    });

const dbSaveNote = (userId, googleBooksId, noteText) =>
  FavoritedBook.findOne({
    where: { UserId: userId, GoogleBooksId: googleBooksId },
  })
    .then((favoritedBook) => {
      if (favoritedBook) {
        return favoritedBook
          .createNote({
            UserId: userId,
            Text: noteText,
          })
          .then((note) => ({
            noteId: note.NoteId,
            text: note.Text,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
          }));
      } else {
        throw new Error('Server error');
      }
    })
    .catch((error) => {
      throw error;
    });

const dbEditNote = (userId, noteId, noteText) =>
  Note.findOne({ where: { UserId: userId, NoteId: noteId } })
    .then((note) => {
      if (note) {
        return note.update({ Text: noteText }).then((updatedNote) => ({
          noteId: updatedNote.NoteId,
          text: updatedNote.Text,
          createdAt: updatedNote.createdAt,
          updatedAt: updatedNote.updatedAt,
        }));
      } else {
        throw new Error('Server error');
      }
    })
    .catch(() => {
      throw new Error('Server error');
    });

const dbDeleteNote = (userId, noteId) =>
  Note.findOne({ where: { UserId: userId, NoteId: noteId } })
    .then((note) => note.destroy())
    .catch(() => {
      throw new Error('Server error');
    });

const dbGetNotes = async (userId, googleBooksId) =>
  FavoritedBook.findOne({
    where: { UserId: userId, GoogleBooksId: googleBooksId },
  })
    .then((favoritedBook) => {
      if (favoritedBook) {
        return favoritedBook.getNotes().then((notes) =>
          notes.map((note) => ({
            noteId: note.NoteId,
            text: note.Text,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
          }))
        );
      } else {
        throw new Error('Server error');
      }
    })
    .catch((error) => {
      throw error;
    });

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
