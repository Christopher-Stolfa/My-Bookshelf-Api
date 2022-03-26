/**
 * @description User class module
 * @module models/user
 */
'use strict';
const bcrypt = require('bcrypt');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  /**
   * Class representing a user object
   * @class
   * @property {number} userId The user id column
   * @property {string} firstName The user first name column
   * @property {string} lastName The user last name column
   * @property {string} email The user email column
   * @property {string} displayName The user display name column
   * @property {string} password The user password hash column
   * @property {string} resetPasswordToken This column is used when a user requests a password reset
   * @property {date} resetPasswordExpires This column is used to hold a time and date that determines when the reset token expires
   * @property {date} createdAt The time this row was created
   * @property {date} updatedAt The last time this row has been updated
   */
  class User extends Model {
    /**
     * @description An instance method that compares the password to the user password hash to check if it's valid
     * @property {Function} validPassword
     * @param {string} password
     * @returns {boolean} Returns true if password is valid and false if not valid
     */
    validPassword(password) {
      return bcrypt.compareSync(password, this.dataValues.password);
    }
    /**
     * @description Sequelize pre-defined static method that inputs sequelize Models and options
     * @param {Object} param
     * @param {Object} param.FavoritedBook
     * @returns {void}
     */
    static associate({ FavoritedBook }) {
      this.hasMany(FavoritedBook, {
        as: 'favoritedBooks',
        foreignKey: 'userId',
      });
    }
    /**
     * @description Static method using bcrypt to generate a salt and then hash the password
     * @param {string} password
     * @returns {string} Returns the hashed password
     */
    static hashPassword = (password) => {
      const salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(password, salt);
    };
    /**
     * @description Static method that checks if a password passes the validation regex
     * @param {string} password
     * @returns {boolean} Returns true if the password is between 8 and 16 characters with at least one uppercase letter, one lowercase letter, one number and one special character, otherwise it returns false
     */
    static validatePassword = (password) =>
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/.test(password);
  }
  /**
   * Sequelize method to create the class
   */
  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: 'user_id',
      },
      firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
      lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Email field cannot be empty',
          },
          isEmail: {
            args: true,
            msg: 'Please enter a valid email address',
          },
          len: {
            args: [3, 50],
            msg: 'Email must be between 3 to 50 characters',
          },
          async exists(email) {
            const userExists = await User.findOne({
              where: { email },
            });
            if (userExists) throw new Error('Email already in use');
          },
        },
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { args: true, msg: 'Display name field cannot be empty' },
          len: { args: [3, 50], msg: 'Display name must be between 3 to 50 characters' },
          async exists(displayName) {
            const userExists = await User.findOne({ where: { displayName } });
            if (userExists) throw new Error('Display name already in use');
          },
        },
        field: 'display_name',
      },
      password: {
        type: DataTypes.STRING(60),
        allowNull: false,
        set(value) {
          if (!User.validatePassword(value)) {
            throw {
              message:
                'Password must have between 8 and 16 characters with at least one uppercase letter, one lowercase letter, one number and one special character',
              code: 400,
            };
          }
          const hash = User.hashPassword(value);
          this.setDataValue('password', hash);
        },
        validate: {
          is: /^\$2[ayb]\$.{56}$/,
        },
      },
      resetPasswordToken: { type: DataTypes.STRING, field: 'reset_password_token' },
      resetPasswordExpires: { type: DataTypes.DATE, field: 'reset_password_expires' },
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
      tableName: 'users',
      modelName: 'User',
      hooks: {
        validationFailed: (instance, options, { errors }) => {
          throw { message: errors.map((err) => ` ${err.message}`), code: 400 };
        },
      },
      instanceMethods: {
        validPassword: (password) => {
          return bcrypt.compareSync(password, this.password);
        },
      },
    }
  );
  return User;
};
