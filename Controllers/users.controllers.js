const {
  createUser,
  findUserByEmail,
  userPasswordValid,
  saveFavoritedBook,
  getFavoritedBooks,
  removeFavoritedBook,
  sendPasswordReset,
  findUserByResetToken,
  updatePasswordViaToken,
} = require("../Services/user.services");

const userSignUp = async (req, res, next) => {
  const bodyData = JSON.parse(req.body.data);
  try {
    const userData = await createUser(bodyData);
    req.session.user = userData;
    res.status(201).json({
      message: "Account successfully created",
      loggedIn: true,
      userData: userData,
    });
  } catch (error) {
    next(error);
  }
};

const userCheckSession = async (req, res) => {
  if (req.session.user) {
    res.status(200).json({
      message: "Login session exists",
      loggedIn: true,
      userData: req.session.user,
    });
  } else {
    res.status(200).json({
      message: "No session exists",
      loggedIn: false,
    });
  }
};

const userSignIn = async (req, res, next) => {
  const bodyData = JSON.parse(req.body.data);
  const { email, password } = bodyData;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      throw { message: "Invalid email or password", code: 401 };
    } else {
      const { UserId, Email, DisplayName, FirstName, LastName, Password } =
        user.toJSON();
      const passwordValid = userPasswordValid(password, Password);
      if (!passwordValid) {
        throw { message: "Invalid email or password", code: 401 };
      } else {
        const userData = {
          userId: UserId,
          email: Email,
          displayName: DisplayName,
          firstName: FirstName,
          lastName: LastName,
        };
        req.session.user = userData;
        res.status(200).json({
          message: "Sign in successful",
          loggedIn: true,
          userData: userData,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

const userSignOut = (req, res, next) => {
  if (req.session.user) {
    req.session.destroy((error) => {
      if (error) {
        throw { message: "Failed to sign out", code: 400 };
      } else {
        res.clearCookie("user-session").status(200).json({
          message: "Sign out successful",
          loggedIn: false,
        });
      }
    });
  } else {
    res.status(200).json({ message: "No session exists", loggedIn: false });
  }
};

const userForgotPassword = async (req, res, next) => {
  const bodyData = JSON.parse(req.body.data);
  const { email } = bodyData;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      throw { message: "Invalid email", code: 401 };
    } else {
      await sendPasswordReset(user);
      res.status(200).json({
        message:
          "Successfully requested a password reset, please check your email for a reset link",
      });
    }
  } catch (error) {
    next(error);
  }
};

const userCheckResetToken = async (req, res, next) => {
  const token = req.query.resetPasswordToken;
  try {
    const userEmail = await findUserByResetToken(token);
    res.status(200).json({
      message: "Reset token is valid",
      email: userEmail,
    });
  } catch (error) {
    next(error);
  }
};

const updatePasswordWithToken = async (req, res, next) => {
  const bodyData = JSON.parse(req.body.data);
  const { token, email, password } = bodyData;
  try {
    await updatePasswordViaToken(token, email, password);
    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userSignUp,
  userSignIn,
  userSignOut,
  userCheckSession,
  userForgotPassword,
  userCheckResetToken,
  updatePasswordWithToken,
};
