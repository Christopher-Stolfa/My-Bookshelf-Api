const { Op } = require("sequelize");
const User = require("../Models/user");
const { getErrors } = require("../Helpers/errorHandler");

const userSignUp = (req, res, next) => {
  const { displayName, firstName, lastName, email, password } = JSON.parse(
    req.body.data
  );
  User.create({
    DisplayName: displayName,
    FirstName: firstName,
    LastName: lastName,
    Email: email,
    Password: password,
  })
    .then((resultData = resultData.toJSON()) => {
      const { UserId, DisplayName, FirstName, LastName, Email } = resultData;
      const userData = {
        userId: UserId,
        email: Email,
        displayName: DisplayName,
        firstName: FirstName,
        lastName: LastName,
      };
      req.session.user = userData;
      res.status(201).json({
        message: "Account successfully created!",
        loggedIn: true,
        userData: userData,
      });
    })
    .catch((err) => {
      res.status(err.code || 500).json({
        message: err.message.toString(),
      });
    });
};

const userCheckSession = (req, res) => {
  res.status(200).json({
    message: req.session.user ? "Login session exists." : "No session exists.",
    loggedIn: req.session.user ? true : false,
    userData: req.session.user ? req.session.user : {},
  });
};

const userSignIn = (req, res) => {
  const { email, password } = JSON.parse(req.body.data);
  User.findOne({ where: { Email: email } })
    .then((user = user.toJSON()) => {
      if (!user) {
        res.status(401).json({
          message: "Invalid email or password",
        });
      } else {
        const passwordValid = User.prototype.validPassword(
          password,
          user.Password
        );
        if (passwordValid) {
          const { UserId, Email, DisplayName, FirstName, LastName } = user;
          const userData = {
            id: UserId,
            email: Email,
            displayName: DisplayName,
            firstName: FirstName,
            lastName: LastName,
          };
          req.session.user = userData;
          res.status(200).json({
            message: "Login successful!",
            loggedIn: true,
            userData: userData,
          });
        } else {
          res.status(401).json({
            message: "Invalid email or password",
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    });
};

const userSignOut = (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          message: "Failed to sign out.",
        });
      } else {
        res.clearCookie("user-session").status(200).json({
          message: "Signed out user successfully.",
          loggedIn: false,
          userData: {}
        });
      }
    });
  } else {
    res.status(200).json({ message: "No session exists.", loggedIn: false });
  }
};

module.exports = {
  userSignUp,
  userSignIn,
  userSignOut,
  userCheckSession,
};
