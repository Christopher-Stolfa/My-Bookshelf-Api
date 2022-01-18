// TODO: Move congested business logic from users controllers into here.
const User = require("../Models/user");
const FavoritedBook = require("../Models/favoritedBook");

const createUser = ({ displayName, firstName, lastName, email, password }) =>
  User.create({
    DisplayName: displayName,
    FirstName: firstName,
    LastName: lastName,
    Email: email,
    Password: password,
  }).then((resultData) => {
    const { UserId, DisplayName, FirstName, LastName, Email } = resultData;
    const userData = {
      userId: UserId,
      email: Email,
      displayName: DisplayName,
      firstName: FirstName,
      lastName: LastName,
    };
    return userData;
  });

const findUserByEmail = (email) =>
  User.findOne({ where: { Email: email } }).then((user) => user);

const userPasswordValid = (passwordToCheck, correctPassword) =>
  User.prototype.validPassword(passwordToCheck, correctPassword);

const saveFavoritedBook = async (
  userId,
  {
    googleBooksId,
    title,
    description,
    authors,
    publisher,
    publishedDate,
    pageCount,
    averageRating,
    ratingsCount,
    imageLink,
    language,
    categories,
  }
) => {
  const user = await User.findOne({ where: { UserId: userId } });
  if (user) {
    const favoritedBook = await user.createFavoritedBook({
      GoogleBooksId: googleBooksId,
      Title: title,
      Description: description,
      Authors: authors,
      Publisher: publisher,
      PublishedDate: publishedDate,
      PageCount: pageCount,
      AverageRating: averageRating,
      RatingsCount: ratingsCount,
      ImageLink: imageLink,
      Language: language,
      Categories: categories,
    });
    return favoritedBook;
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  userPasswordValid,
  saveFavoritedBook,
};
