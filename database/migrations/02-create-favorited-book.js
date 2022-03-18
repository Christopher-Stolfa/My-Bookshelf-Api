'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('favorited_books', {
      favoritedBookId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: 'favorited_book_id',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      googleBooksId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'google_books_id',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      authors: {
        type: DataTypes.STRING,
        allowNull: false,
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
      },
      isReading: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'is_reading',
      },
      progress: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('favorited_books');
  },
};
