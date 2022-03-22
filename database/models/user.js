'use strict';
const bcrypt = require('bcrypt');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Instance Methods
     *
     * @param {string} password
     * @returns {boolean}
     */
    validPassword(password) {
      return bcrypt.compareSync(password, this.dataValues.password);
    }
    /**
     * Static Methods
     *
     * @param {Object} param
     * @param {Object} param.FavoritedBook
     */
    static associate({ FavoritedBook }) {
      this.hasMany(FavoritedBook, {
        as: 'favoritedBooks',
        foreignKey: 'userId',
      });
    }
    /**
     *
     * @param {string} password
     * @returns {string}
     */
    static hashPassword = (password) => {
      const salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(password, salt);
    };
    static validatePassword = (password) =>
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/.test(password);
  }
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
      resetPasswordExpires: { type: DataTypes.STRING, field: 'reset_password_expires' },
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
