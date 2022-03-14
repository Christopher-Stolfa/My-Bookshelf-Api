const User = require('../Models/user.js');
const Note = require('../Models/note.js');
const FavoritedBook = require('../Models/favoritedBook.js');

const dbSaveFavoritedBook = (userId, book) =>
  User.findOne({ where: { UserId: userId } }).then(
    (user) =>
      user &&
      user
        .createFavoritedBook({
          GoogleBooksId: book.googleBooksId,
          Title: book.title,
          Description: book.description,
          Authors: book.authors,
          Publisher: book.publisher,
          PublishedDate: book.publishedDate,
          PageCount: book.pageCount,
          AverageRating: book.averageRating,
          RatingsCount: book.ratingsCount,
          ImageLink: book.imageLink,
          Language: book.language,
          Categories: book.categories,
          IsReading: false,
          Progress: 0,
        })
        .then((book) => ({
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
  );

const dbRemoveFavoritedBook = (userId, book) =>
  User.findOne({ where: { UserId: userId } }).then(
    (user) =>
      user &&
      FavoritedBook.destroy({
        where: { GoogleBooksId: book.googleBooksId, UserId: user.UserId },
      }).then(() => book)
  );

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
