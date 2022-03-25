'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('notes', {
      noteId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: 'note_id',
      },
      text: {
        type: DataTypes.TEXT,
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
      favoritedBookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'favorited_book_id',
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('notes');
  },
};
