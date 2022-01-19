const Sequelize = require("sequelize");
const sequelize = require("../Config/databaseConfig");
const FavoritedBook = require("./favoritedBook");
const bcrypt = require("bcrypt");

// Creates a User Schema and exports it as a User Model.
const User = sequelize.define(
  "User",
  {
    UserId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    FirstName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: "First name must be between 2 - 50 characters"
        },
        notEmpty: {
          args: true,
          msg: "First name field cannot be empty"
        }
      }
    },
    LastName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: "Last name must be between 2 - 50 characters"
        },
        notEmpty: {
          args: true,
          msg: "Last name field cannot be empty"
        }
      }
    },
    DisplayName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Display name field cannot be empty"
        },
        len: {
          args: [3, 50],
          msg: "Display name must be between 3 to 50 characters"
        },
        async exists(displayName) {
          const userExists = await User.findOne({
            where: { DisplayName: displayName }
          });
          if (userExists) throw new Error("Display name already in use");
        }
      }
    },
    Email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Email field cannot be empty"
        },
        isEmail: {
          args: true,
          msg: "Please enter a valid email address"
        },
        len: {
          args: [3, 50],
          msg: "Email must be between 3 to 50 characters"
        },
        async exists(email) {
          const userExists = await User.findOne({
            where: { Email: email }
          });
          if (userExists) throw new Error("Email already in use");
        }
      }
    },
    Password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Password field cannot be empty"
        },
        len: {
          args: [8, 12],
          msg: "Password must be between 8 - 12 characters"
        }
      }
    }
  },
  {
    hooks: {
      validationFailed: (instance, options, { errors }) => {
        throw { message: errors.map(err => ` ${err.message}`), code: 400 };
      },
      beforeCreate: user => {
        if (user.Password) {
          const salt = bcrypt.genSaltSync(10);
          user.Password = bcrypt.hashSync(user.Password, salt);
        }
      },
      beforeUpdate: user => {
        if (user.Password) {
          const salt = bcrypt.genSaltSync(10);
          user.Password = bcrypt.hashSync(user.Password, salt);
        }
      }
    },
    instanceMethods: {
      validPassword: password => {
        return bcrypt.compareSync(password, this.Password);
      }
    }
  }
);

User.prototype.validPassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

User.hasMany(FavoritedBook, {
  as: "FavoritedBooks",
  foreignKey: "UserId",
  onDelete: "cascade",
  allowNull: false,
});

module.exports = User;
