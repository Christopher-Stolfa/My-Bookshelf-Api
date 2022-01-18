// TODO: Move congested business logic from users controllers into here.
const User = require("../Models/user");

const createUser = ({ displayName, firstName, lastName, email, password }) =>
  User.create({
    DisplayName: displayName,
    FirstName: firstName,
    LastName: lastName,
    Email: email,
    Password: password
  }).then(resultData => {
    const { UserId, DisplayName, FirstName, LastName, Email } = resultData;
    const userData = {
      userId: UserId,
      email: Email,
      displayName: DisplayName,
      firstName: FirstName,
      lastName: LastName
    };
    return userData;
  });

const findUserByEmail = email =>
  User.findOne({ where: { Email: email } }).then(user => user);

const userPasswordValid = (passwordToCheck, correctPassword) =>
  User.prototype.validPassword(passwordToCheck, correctPassword);

const saveFavoritedBook = (userId, book) =>
  User.findOne({ where: { UserId: userId } }).then(
    user =>
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
          Categories: book.categories
        })
        .then(book => ({
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
          categories: book.Categories
        }))
  );

const getFavoritedBooks = userId =>
  User.findOne({ where: { UserId: userId } }).then(
    user =>
      user &&
      user.getFavoritedBooks().then(books =>
        books.map(book => ({
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
          categories: book.Categories
        }))
      )
  );

module.exports = {
  createUser,
  findUserByEmail,
  userPasswordValid,
  saveFavoritedBook,
  getFavoritedBooks
};
