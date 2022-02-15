// TODO: Move congested business logic from users controllers into here.
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../Models/user");
const FavoritedBook = require("../Models/favoritedBook");

const createUser = ({ displayName, firstName, lastName, email, password }) => {
  if (
    !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/.test(
      password
    )
  ) {
    throw {
      message:
        "Password must have between 8 and 16 characters with at least one uppercase letter, one lowercase letter, one number and one special character",
      code: 400,
    };
  }
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
};

const findUserByEmail = (email) =>
  User.findOne({ where: { Email: email } }).then((user) => user);

const userPasswordValid = (passwordToCheck, correctPassword) =>
  User.prototype.validPassword(passwordToCheck, correctPassword);

const saveFavoritedBook = (userId, book) =>
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

const removeFavoritedBook = (userId, book) =>
  User.findOne({ where: { UserId: userId } }).then(
    (user) =>
      user &&
      FavoritedBook.destroy({
        where: { GoogleBooksId: book.googleBooksId, UserId: user.UserId },
      }).then(() => book)
  );

const getFavoritedBooks = (userId) =>
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

const sendPasswordReset = (user) => {
  const token = crypto.randomBytes(20).toString("hex");
  user.update({
    ResetPasswordToken: token,
    ResetPasswordExpires: Date.now() + 3600000,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${process.env.TRANSPORTER_EMAIL}`,
      pass: `${process.env.TRANSPORTER_PASSWORD}`,
    },
  });

  const mailOptions = {
    from: "MyBookshelfNoReply@gmail.com",
    to: `${user.Email}`,
    subject: "Link To Reset Your MyLibrary Password",
    text:
      "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
      `${process.env.LOCALHOST_CLIENT_ORIGIN}/reset/${token}\n\n` +
      "If you did not request this, please ignore this email and your password will remain unchanged.\n",
  };

  transporter.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.error("there was an error: ", error);
      throw error;
    } else {
      console.log("here is the res: ", response);
      user.save();
    }
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  userPasswordValid,
  saveFavoritedBook,
  getFavoritedBooks,
  removeFavoritedBook,
  sendPasswordReset,
};
