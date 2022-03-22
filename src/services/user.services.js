const nodemailer = require('nodemailer');
const Sequelize = require('sequelize');
const crypto = require('crypto');
const { User } = require('../../database/models');

const createUser = ({ displayName, firstName, lastName, email, password }) =>
  User.create({
    displayName,
    firstName,
    lastName,
    email,
    password,
  });

const findUserByResetToken = (token) =>
  User.findOne({
    where: {
      ResetPasswordToken: token,
      ResetPasswordExpires: {
        [Sequelize.Op.gt]: Date.now(),
      },
    },
  }).then((user) => {
    if (user === null) {
      throw {
        message: 'Password reset link is invalid or has expired',
        code: 403,
      };
    } else {
      return user.Email;
    }
  });

const deleteUserByEmail = (email) => User.destroy({ where: { Email: email } }).then((user) => user);

const signIn = async ({ email, password }) => {
  const user = await User.findOne({ where: { Email: email } }).then((user) => user);
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

const updatePasswordViaToken = (token, email, password) =>
  User.findOne({
    where: {
      Email: email,
      ResetPasswordToken: token,
      ResetPasswordExpires: {
        [Sequelize.Op.gt]: Date.now(),
      },
    },
  }).then((user) => {
    if (user === null) {
      throw {
        message: 'Password reset link is invalid or has expired',
        code: 403,
      };
    } else if (user !== null) {
      console.log('user exists in db');
      user.update({
        Password: password,
        ResetPasswordToken: null,
        ResetPasswordExpires: null,
      });
    } else {
      throw { message: 'User does not exist', code: 401 };
    }
  });

/**
 * @param {Object} param
 * @param {String} param.email
 * @param {String} param.currentPassword
 * @param {String} param.newPassword
 */
const updatePasswordService = async ({ email, currentPassword, newPassword }) => {
  const user = await _findUserByEmail(email);
  if (!user) throw { message: 'User does not exist', code: 404 };
  if (!user.validPassword(currentPassword)) throw { message: 'Invalid email or password', code: 401 };
  await user.update({ password: newPassword });
};

const sendPasswordReset = (user) => {
  const token = crypto.randomBytes(20).toString('hex');
  // Token expires in 10 minutes
  user.update({
    ResetPasswordToken: token,
    ResetPasswordExpires: Date.now() + 600000,
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${process.env.TRANSPORTER_EMAIL}`,
      pass: `${process.env.TRANSPORTER_PASSWORD}`,
    },
  });

  const mailOptions = {
    from: 'MyBookshelfNoReply@gmail.com',
    to: `${user.Email}`,
    subject: 'Link To Reset Your MyLibrary Password',
    text:
      'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' +
      `${process.env.CLIENT_ORIGIN}/reset/${token}\n\n` +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n',
  };

  transporter.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.error('there was an error: ', error);
      throw error;
    } else {
      console.log('here is the res: ', response);
      user.save();
    }
  });
};

const _findUserByEmail = (email) => User.findOne({ where: { email } });

module.exports = {
  createUser,
  signIn,
  sendPasswordReset,
  findUserByResetToken,
  updatePasswordViaToken,
  updatePasswordService,
  deleteUserByEmail,
};
