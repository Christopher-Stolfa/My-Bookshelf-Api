const { Op } = require("sequelize");
const User = require("../Models/user");
const {
  createUser,
  findUser,
  userPasswordValid,
} = require("../Services/user.services");
const { getErrors } = require("../Helpers/errorHandler");

const userSignUp = async (req, res, next) => {
  const bodyData = JSON.parse(req.body.data);
  try {
    const userData = await createUser(bodyData);
    req.session.user = userData;
    res.status(201).json({
      message: "Account successfully created!",
      loggedIn: true,
      userData: userData,
    });
  } catch (err) {
    res.status(err.code || 500).json({
      message: err.message.toString(),
    });
  }
};

const userCheckSession = (req, res) => {
  res.status(200).json({
    message: req.session.user ? "Login session exists." : "No session exists.",
    loggedIn: req.session.user ? true : false,
    userData: req.session.user ? req.session.user : {},
  });
};

const userSignIn = async (req, res) => {
  const bodyData = JSON.parse(req.body.data);
  const { email, password } = bodyData;
  try {
    const user = await findUser(email);
    if (!user) {
      throw { message: "Invalid email or password", code: 401 };
    } else {
      const { UserId, Email, DisplayName, FirstName, LastName, Password } =
        user;

      const passwordValid = userPasswordValid(password, Password);
      if (!passwordValid) {
        throw { message: "Invalid email or password", code: 401 };
      } else {
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
      }
    }
  } catch (err) {
    res.status(err.code || 500).json({
      message: err.message.toString(),
    });
  }
};

const userSignOut = (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).json({
          message: "Failed to sign out.",
        });
      } else {
        res.clearCookie("user-session").status(200).json({
          message: "Signed out user successfully.",
          loggedIn: false,
          userData: {},
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
