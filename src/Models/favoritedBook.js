import Sequelize from 'sequelize';
import sequelize from '../Config/databaseConfig.js';
import Note from './note.js';

const FavoritedBook = sequelize.define(
  'FavoritedBook',
  {
    FavoritedBookId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    GoogleBooksId: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        async exists(googleBooksId) {
          const book = await FavoritedBook.findOne({
            where: { GoogleBooksId: googleBooksId, UserId: this.UserId },
          });
          if (book) throw new Error('Item already in favorites');
        },
        notEmpty: {
          args: true,
          msg: 'Id field cannot be empty.',
        },
      },
    },
    Title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Title field cannot be empty.',
        },
      },
    },
    Description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    Authors: {
      type: Sequelize.STRING,
      allowNull: false,
      get() {
        return this.getDataValue('Authors').split(';');
      },
      set(authors) {
        this.setDataValue('Authors', authors.join(';'));
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
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    AverageRating: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    RatingsCount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    Language: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ImageLink: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    Categories: {
      type: Sequelize.TEXT,
      allowNull: false,
      get() {
        return this.getDataValue('Categories').split(';');
      },
      set(categories) {
        this.setDataValue('Categories', categories.join(';'));
      },
    },
    IsReading: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    Progress: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
        isNumeric: {
          args: true,
          msg: 'Progress must be a number',
        },
        notEmpty: {
          args: true,
        },
      },
    },
  },
  {
    hooks: {
      beforeValidate: (book) => {
        if (isNaN(book.Progress) || book.Progress < 0 || book.Progress > 100) {
          throw {
            message: 'Progress must be a number from 0 to 100',
            code: 400,
          };
        }
      },
      validationFailed: () => {
        // console.log(errors);
        // throw { message: "Server error", code: 500 };
      },
    },
  }
);

FavoritedBook.hasMany(Note, {
  as: 'Notes',
  foreignKey: 'FavoritedBookId',
  onDelete: 'cascade',
  allowNull: false,
});

export default FavoritedBook;
