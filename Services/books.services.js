const User = require("../Models/user");
const Note = require("../Models/note");
const FavoritedBook = require("../Models/favoritedBook");

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
        }))
      )
  );

const dbSaveNote = async (userId, googleBooksId, noteText) =>
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
        throw new Error("Server error");
      }
    })
    .catch((error) => {
      throw error;
    });

const dbEditNote = () => {};

const dbDeleteNote = (userId, noteId) =>
  Note.findOne({ where: { UserId: userId, NoteId: noteId } })
    .then((note) => note.destroy())
    .catch((error) => {
      throw new Error("Server error");
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
        throw new Error("Server error");
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
};
