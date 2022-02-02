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
      unique: true,
      primaryKey: true
    },
    GoogleBooksId: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        async exists(googleBooksId) {
          const book = await FavoritedBook.findOne({
            where: { GoogleBooksId: googleBooksId, UserId: this.UserId }
          });
          if (book) throw new Error("Item already in favorites");
        },
        notEmpty: {
          args: true,
          msg: "Id field cannot be empty."
        }
      }
    },
    Title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Title field cannot be empty."
        }
      }
    },
    Description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    Authors: {
      type: Sequelize.STRING,
      allowNull: false,
      get() {
        return this.getDataValue("Authors").split(";");
      },
      set(authors) {
        this.setDataValue("Authors", authors.join(";"));
      }
    },
    Publisher: {
      type: Sequelize.STRING,
      allowNull: false
    },
    PublishedDate: {
      type: Sequelize.STRING,
      allowNull: false
    },
    PageCount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    AverageRating: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    RatingsCount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    Language: {
      type: Sequelize.STRING,
      allowNull: false
    },
    ImageLink: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    Categories: {
      type: Sequelize.TEXT,
      allowNull: false,
      get() {
        return this.getDataValue("Categories").split(";");
      },
      set(categories) {
        this.setDataValue("Categories", categories.join(";"));
      }
    }
  },
  {
    hooks: {
      validationFailed: (instance, options, { errors }) => {
        throw { message: "Error favoriting book", code: 500 };
      }
    }
  }
);

module.exports = FavoritedBook;
