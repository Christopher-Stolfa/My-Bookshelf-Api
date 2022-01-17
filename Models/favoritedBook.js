const Sequelize = require("sequelize");
const sequelize = require("../Config/databaseConfig");

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
      validate: {
        notEmpty: {
          args: true,
          msg: "BookId field cannot be empty.",
        },
      },
    },
    Title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Title field cannot be empty.",
        },
      },
    },
    Description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Authors: {
      type: Sequelize.STRING,
      allowNull: false,
      get() {
        return this.getDataValue("Authors").split(";");
      },
      set(authors) {
        this.setDataValue("Authors", authors.join(";"));
      },
    },
    Publisher: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    PublishedDate: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    PageCount: {
      type: Sequelize.NUMBER,
      allowNull: false,
    },
    AverageRating: {
      type: Sequelize.NUMBER,
      allowNull: false,
    },
    RatingsCount: {
      type: Sequelize.NUMBER,
      allowNull: false,
    },
    ImageLinks: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Language: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ImageLink: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Categories: {
      type: Sequelize.STRING,
      allowNull: false,
      get() {
        return this.getDataValue("Categories").split(";");
      },
      set(categories) {
        this.setDataValue("Categories", categories.join(";"));
      },
    },
  },
  {
    hooks: {},
  }
);

module.exports = FavoritedBook;
