const User = require("../Models/user");
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

const dbSaveNote = () => {};

const dbEditNote = () => {};

const dbDeleteNote = () => {};

const dbGetNotes = () => {};

module.exports = {
  dbSaveFavoritedBook,
  dbRemoveFavoritedBook,
  dbGetFavoritedBooks,
  dbSaveNote,
  dbEditNote,
  dbDeleteNote,
  dbGetNotes,
};
