import Sequelize from "sequelize";
import sequelize from "../Config/databaseConfig.js";
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
        throw { message: "Server error", code: 500 };
      },
    },
  }
);

export default Note;
