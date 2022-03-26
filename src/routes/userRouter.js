/**
 * @description - Router that handles api methods for users
 * @module routes/userRouter
 * @see module:constants/usersRoutes
 * @see module:controllers/userController
 */
const express = require('express');
const {
  userSignUp,
  userSignIn,
  userSignOut,
  userCheckSession,
  userForgotPassword,
  userCheckResetToken,
  updatePasswordWithToken,
  updatePassword,
} = require('../controllers/userController');
const {
  SIGN_OUT,
  SIGN_UP,
  SIGN_IN,
  CHECK_SESSION,
  CHECK_RESET_TOKEN,
  FORGOT_PASSWORD,
  UPDATE_PASSWORD_WITH_TOKEN,
  UPDATE_PASSWORD,
} = require('../constants/usersRoutes');

/**
 * @description - Express router for mounting book controller methods
 * @property {Function} get
 * @property {Function} post
 * @property {Function} put
 * @property {Function} delete
 */
const router = express.Router();

/**
 * @description - Route for handling a user signout, it destroys the session and cookie
 * @function
 * @param {string} path - Express path
 * @param {callback} userSignOut - Controller/express middleware
 */
router.post(SIGN_OUT, userSignOut);

/**
 * @description - Route for handling a user sign up
 * @function
 * @param {string} path - Express path
 * @param {callback} userSignUp - Controller/express middleware
 */
router.post(SIGN_UP, userSignUp);

/**
 * @description - Route for handling a user sign in, creating a user session
 * @function
 * @param {string} path - Express path
 * @param {callback} userSignIn - Controller/express middleware
 */
router.post(SIGN_IN, userSignIn);

/**
 * @description - Route for requesting a password reset email
 * @function
 * @param {string} path - Express path
 * @param {callback} userForgotPassword - Controller/express middleware
 */
router.post(FORGOT_PASSWORD, userForgotPassword);

/**
 * @description - Route for resetting a user's password with a reset token accessed from their email
 * @function
 * @param {string} path - Express path
 * @param {callback} updatePasswordWithToken - Controller/express middleware
 */
router.put(UPDATE_PASSWORD_WITH_TOKEN, updatePasswordWithToken);

/**
 * @description - Route for updating a user's password using their current password
 * @function
 * @param {string} path - Express path
 * @param {callback} updatePassword - Controller/express middleware
 */
router.put(UPDATE_PASSWORD, updatePassword);

/**
 * @description - Route for checking if there is an active user session associated with a cookie
 * @function
 * @param {string} path - Express path
 * @param {callback} userCheckSession - Controller/express middleware
 */
router.get(CHECK_SESSION, userCheckSession);

/**
 * @description - Route for checking if a password reset token is valid
 * @function
 * @param {string} path - Express path
 * @param {callback} userCheckResetToken - Controller/express middleware
 */
router.get(CHECK_RESET_TOKEN, userCheckResetToken);

module.exports = router;
