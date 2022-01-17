const Sequelize = require("sequelize");
const sequelize = require("../Config/databaseConfig");
const User = require("./user");
const Book = require("./book");
// Creates a User Schema and exports it as a User Model.
const FavoritedBook = sequelize.define(
  "FavoritedBook",
  {
    FavoritedBookId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    GoogleBooksId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: "GoogleBookId field cannot be empty.",
        },
      },
    },
  },
  {
    hooks: {},
  }
);

FavoritedBook.belongsTo(Book, {
  as: "FavoritedBooks",
  foreignKey: "BookId",
  onDelete: "cascade",
  allowNull: false,
});

module.exports = FavoritedBook;
