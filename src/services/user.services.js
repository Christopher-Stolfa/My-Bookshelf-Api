const nodemailer = require('nodemailer');
const Sequelize = require('sequelize');
const crypto = require('crypto');
const { User } = require('../../database/models');
const config = require('config');

/**
 * Creates a user in the database
 * @param {Object} param
 * @param {string} param.displayName
 * @param {string} param.firstName
 * @param {string} param.lastName
 * @param {string} param.email
 * @param {string} param.password
 * @throws {error} - Error creating user if user is null
 * @returns {Object} - Returns an object with user data
 */
const createUser = async ({ displayName, firstName, lastName, email, password }) => {
  const user = await User.create({
    displayName,
    firstName,
    lastName,
    email,
    password,
  });
  if (!user) throw { message: 'Error creating user', code: 400 };
  const userData = {
    userId: user.userId,
    email: user.email,
    displayName: user.displayName,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  return userData;
};

/**
 * Searches the database for a user with the reset token
 * @param {string} token
 * @returns {string} - Returns a user email
 * @throws {error} - Error finding user by reset token
 */
const findUserByResetToken = async (token) => {
  const user = await User.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: {
        [Sequelize.Op.gt]: Date.now(),
      },
    },
  });
  if (!user)
    throw {
      message: 'Password reset link is invalid or has expired',
      code: 403,
    };
  return user.email;
};

/**
 * Deletes a user by email - TODO: Refactor this to be called safely by the client
 * @param {string} email
 * @returns {Object} - Returns a user object
 * @throws {error}
 */
const deleteUserByEmail = (email) => User.destroy({ where: { email } }).then((user) => user);

/**
 * Attempts to sign in a user by first checking if they exist via email, and then checking if the password is valid
 * @param {Object} param
 * @returns {Object} - Returns an object of user data
 * @throws {error} - Error if can't find user by email, password is invalid, or user doesn't exist
 */
const signIn = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw { message: 'Invalid email or password', code: 401 };
  if (!user.validPassword(password)) throw { message: 'Invalid email or password', code: 401 };
  const userData = {
    userId: user.userId,
    email: user.email,
    displayName: user.displayName,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  return userData;
};

/**
 * Checks if a user exists with the email and token, then updates the password with the new one
 * @param {Object} param
 * @param {string} param.token
 * @param {string} param.email
 * @param {string} param.password
 * @throws {error} - Throws an error if password reset link is invalid
 */
const updatePasswordViaToken = async ({ token, email, password }) => {
  const user = await User.findOne({
    where: {
      email,
      resetPasswordToken: token,
      resetPasswordExpires: {
        [Sequelize.Op.gt]: Date.now(),
      },
    },
  });
  if (!user)
    throw {
      message: 'Password reset link is invalid or has expired',
      code: 403,
    };
  await user.update({
    password,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  });
};

/**
 * Updates a user's password
 * @param {Object} param
 * @param {String} param.email
 * @param {String} param.currentPassword
 * @param {String} param.newPassword
 * @throws {error} - Throws an error if the user doesn't exist or password is invalid
 */
const updateUserPassword = async ({ email, currentPassword, newPassword }) => {
  const user = await findUserByEmail(email);
  if (!user) throw { message: 'User does not exist', code: 404 };
  if (!user.validPassword(currentPassword)) throw { message: 'Invalid email or password', code: 401 };
  await user.update({ password: newPassword });
};

/**
 * Sends an password reset link via email
 * @param {string} email
 * @throws {error} - Throws an error if the user doesn't exist or if the transporter fails to send an email
 */
const sendPasswordReset = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) throw { message: 'Invalid email', code: 401 };

  const { auth } = config.get('mail');
  const origin = config.get('origin');

  const token = crypto.randomBytes(20).toString('hex');
  // Token expires in 10 minutes
  user.update({
    resetPasswordToken: token,
    resetPasswordExpires: Date.now() + 600000,
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth,
  });

  const mailOptions = {
    from: 'MyBookshelfNoReply@gmail.com',
    to: `${user.email}`,
    subject: 'Link To Reset Your MyLibrary Password',
    text:
      'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' +
      `${origin}/reset/${token}\n\n` +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n',
  };

  transporter.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.error('there was an error: ', error);
      throw { message: error.toString(), code: 400 };
    } else {
      console.log('here is the res: ', response);
      user.save();
    }
  });
};

/**
 * Finds a user by email and returns the user instance
 * @param {string} email
 * @returns {Object} - Returns a user object instance
 * @throws - Throws an error if the user doesn't exist
 */
const findUserByEmail = async (email) => {
  const user = User.findOne({ where: { email } });
  if (!user) throw { message: 'Invalid email', code: 401 };
  return user;
};

module.exports = {
  createUser,
  signIn,
  sendPasswordReset,
  findUserByResetToken,
  updatePasswordViaToken,
  updateUserPassword,
  deleteUserByEmail,
  findUserByEmail,
};
