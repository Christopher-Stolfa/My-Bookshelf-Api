/**
 * @description - Controller functions for handling api requests regarding users
 * @module controllers/userController
 * @see module:services/userService
 */
const {
  dbCreateUser,
  findUserCheckPass,
  updateUserPassword,
  sendPasswordReset,
  findUserByResetToken,
  updatePasswordViaToken,
} = require('../services/userService');

/**
 * @description - Creates a new user with provided the correct params
 * @function userSignUp
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const userSignUp = async (req, res, next) => {
  const bodyData = req.body;
  try {
    const userData = await dbCreateUser(bodyData);
    req.session.user = userData;
    res.status(201).json({
      message: 'Account successfully created',
      loggedIn: true,
      userData: userData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description - Checks if a user session exists provided a valid cookie
 * @function userCheckSession
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const userCheckSession = async (req, res) => {
  if (req.session.user) {
    res.status(200).json({
      message: 'Login session exists',
      loggedIn: true,
      userData: req.session.user,
    });
  } else {
    res.status(200).json({
      message: 'No session exists',
      loggedIn: false,
    });
  }
};

/**
 * @description - Signs in a user if provided the correct credentials and initializes a user session
 * @function userSignIn
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const userSignIn = async (req, res, next) => {
  const bodyData = req.body;
  try {
    const userData = await findUserCheckPass(bodyData);
    req.session.user = userData;
    res.status(200).json({
      message: 'Sign in successful',
      loggedIn: true,
      userData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description - Updates a user's password if provided the correct credentials
 * @function updatePassword
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updatePassword = async (req, res, next) => {
  try {
    if (!req.session.user) throw { message: 'Invalid credentials', code: 401 };
    const bodyData = JSON.parse(req.body.data);
    const email = req.session.user.email;
    const { currentPassword, newPassword } = bodyData;
    await updateUserPassword({ email, currentPassword, newPassword });
    res.status(200).json({
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description - Signs out a user by closing their session and destroying the cookie
 * @function userSignOut
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const userSignOut = (req, res, next) => {
  try {
    if (!req.session.user) throw { message: 'Invalid credentials', code: 401 };
    req.session.destroy((error) => {
      if (error) throw { message: 'Failed to sign out', code: 400 };
      res.clearCookie('user-session').status(200).json({
        message: 'Sign out successful',
        loggedIn: false,
      });
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description - Sends an email with a password reset link if user email exists in the database
 * @function userForgotPassword
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const userForgotPassword = async (req, res, next) => {
  try {
    const bodyData = JSON.parse(req.body.data);
    const { email } = bodyData;
    await sendPasswordReset(email);
    res.status(200).json({
      message: 'Successfully requested a password reset, please check your email for a reset link',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description - Checks if a password reset token is valid
 * @function userCheckResetToken
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const userCheckResetToken = async (req, res, next) => {
  try {
    const token = req.query.resetPasswordToken;
    const userEmail = await findUserByResetToken(token);
    res.status(200).json({
      message: 'Reset token is valid',
      email: userEmail,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description - Updates the password for the user associated with the reset token
 * @function updatePasswordWithToken
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updatePasswordWithToken = async (req, res, next) => {
  const bodyData = JSON.parse(req.body.data);
  const { token, email, password } = bodyData;
  try {
    await updatePasswordViaToken({ token, email, password });
    res.status(200).json({
      message: 'Password updated successfully',
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
  updatePassword,
};
