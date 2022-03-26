/**
 * @description - Note class module
 * @module database/models/note
 */
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  /**
   * @description - Class and schema for Note
   * @class
   * @property {number} noteId - primary note id
   * @property {string} text - note text
   * @property {date} createdAt - time and date created
   * @property {date} updatedAt - time and date updated
   */
  class Note extends Model {
    /**
     * @description - Sequelize pre-defined static method that inputs sequelize Models and options
     * @param {Object} param
     * @param {Object} param.Note
     * @returns {void}
     */
    static associate({ Note }) {
      this.belongsTo(Note, { foreignKey: 'favoritedBookId', as: 'note' });
    }
  }
  Note.init(
    {
      noteId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: 'note_id',
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Text field cannot be empty.',
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
      tableName: 'notes',
      modelName: 'Note',
    }
  );
  return Note;
};
