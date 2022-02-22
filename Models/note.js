const Sequelize = require("sequelize");
const sequelize = require("../Config/databaseConfig");
const Note = sequelize.define(
  "Note",
  {
    NoteId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    Text: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Text field cannot be empty.",
        },
      },
    },
  },
  {
    hooks: {
      validationFailed: (instance, options, { errors }) => {
        console.log(errors);
        throw { message: "Error creating note", code: 500 };
      },
    },
  }
);

module.exports = Note;
