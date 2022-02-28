import {
  createUser,
  findUserByEmail,
  userPasswordValid,
  sendPasswordReset,
  findUserByResetToken,
  updatePasswordViaToken,
  dbUpdatePassword,
} from "../Services/user.services.js";

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
  console.log(req.session.cookie);
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
        req.session.save();
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

const updatePassword = async (req, res, next) => {
  try {
    if (!req.session.user) throw { message: "Invalid credentials", code: 401 };
    const bodyData = JSON.parse(req.body.data);
    const email = req.session.user.email;
    const { currentPassword, newPassword } = bodyData;
    const user = await findUserByEmail(email);
    if (!user) {
      throw { message: "User does not exist", code: 404 };
    } else {
      const passwordValid = userPasswordValid(currentPassword, user.Password);
      if (!passwordValid) {
        throw { message: "Invalid email or password", code: 401 };
      } else {
        await dbUpdatePassword(user, newPassword);
        res.status(200).json({
          message: "Password updated successfully",
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

const userSignOut = (req, res, next) => {
  try {
    if (!req.session.user) throw { message: "Invalid credentials", code: 401 };
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
  } catch (error) {
    next(error);
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

export {
  userSignUp,
  userSignIn,
  userSignOut,
  userCheckSession,
  userForgotPassword,
  userCheckResetToken,
  updatePasswordWithToken,
  updatePassword,
};
