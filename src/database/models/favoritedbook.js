'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FavoritedBook extends Model {
    static associate({ User, Note }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      this.hasMany(Note, {
        as: 'notes',
        foreignKey: 'favoritedBookId',
      });
    }
  }
  FavoritedBook.init(
    {
      favoritedBookId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: 'favorited_book_id',
      },
      googleBooksId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          async exists(googleBooksId) {
            const book = await FavoritedBook.findOne({
              where: { googleBooksId, userId: this.userId },
            });
            if (book) throw new Error('Item already in favorites');
          },
          notEmpty: {
            args: true,
            msg: 'Id field cannot be empty.',
          },
        },
        field: 'google_books_id',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Title field cannot be empty.',
          },
        },
      },
      description: { type: DataTypes.TEXT, allowNull: false },
      authors: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return this.getDataValue('authors').split(';');
        },
        set(authors) {
          this.setDataValue('authors', authors.join(';'));
        },
      },
      publisher: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      publishedDate: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'published_date',
      },
      pageCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'page_count',
      },
      averageRating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'average_rating',
      },
      ratingsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'ratings_count',
      },
      language: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageLink: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'image_link',
      },
      categories: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
          return this.getDataValue('Categories').split(';');
        },
        set(categories) {
          this.setDataValue('Categories', categories.join(';'));
        },
      },
      isReading: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'is_reading',
      },
      progress: {
        type: DataTypes.INTEGER,
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'favorited_books',
      modelName: 'FavoritedBook',
      hooks: {
        beforeValidate: (book) => {
          if (isNaN(book.Progress) || book.Progress < 0 || book.Progress > 100) {
            throw { message: 'Progress must be a number from 0 to 100', code: 400 };
          }
        },
      },
    }
  );
  return FavoritedBook;
};
