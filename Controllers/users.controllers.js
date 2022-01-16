const { Op } = require("sequelize");
const User = require("../Models/user");
const { getErrors } = require("../Helpers/errorHandler");

const userSignUp = (req, res, next) => {
  const { displayName, firstName, lastName, email, password } = JSON.parse(
    req.body.data
  );
  User.findAll({
    where: {
      [Op.or]: [
        { email: { [Op.like]: email } },
        { displayName: { [Op.like]: displayName } },
      ],
    },
  })
    .then((users) => {
      if (users.length >= 1) {
        res.status(409).json({
          message: "Email or Display name already exists.",
        });
      } else {
        User.create({
          displayName,
          firstName,
          lastName,
          email,
          password,
        })
          .then((resultData = resultData.toJSON()) => {
            const { id, email, displayName, firstName, lastName } = resultData;
            const userData = { id, email, displayName, firstName, lastName };
            req.session.user = userData;
            res.status(201).json({
              message: "Account successfully created!",
              loggedIn: true,
              userData: userData,
            });
          })
          .catch((err) => {
            res.status(400).json({
              message: getErrors(err),
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    });
};

const userCheckSession = (req, res) => {
  if (req.session.user) {
    const { id, email, displayName, firstName, lastName } = req.session.user;
    const userData = { id, email, displayName, firstName, lastName };
    res.status(200).json({
      message: "Login session exists.",
      loggedIn: true,
      userData: userData,
    });
  } else {
    res.status(200).json({ message: "No session exists.", loggedIn: false });
  }
};

const userSignIn = (req, res) => {
  const { email, password } = JSON.parse(req.body.data);
  User.findOne({ where: { email: email } })
    .then((user = user.toJSON()) => {
      if (!user) {
        res.status(401).json({
          message: "The email you have entered does not exist.",
        });
      } else {
        const passwordValid = User.prototype.validPassword(
          password,
          user.password
        );
        if (passwordValid) {
          const { id, email, displayName, firstName, lastName } = user;
          const userData = { id, email, displayName, firstName, lastName };
          req.session.user = userData;
          res.status(200).json({
            message: "Login successful!",
            loggedIn: true,
            userData: userData,
          });
        } else {
          res.status(401).json({
            message: "Invalid Email or Password.",
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
