const nodemailer = require('nodemailer');
const Sequelize = require('sequelize');
const crypto = require('crypto');
const User = require('../Models/user.js');

const validatePassword = (password) =>
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/.test(password);

const createUser = ({ displayName, firstName, lastName, email, password }) => {
  if (!validatePassword(password)) {
    throw {
      message:
        'Password must have between 8 and 16 characters with at least one uppercase letter, one lowercase letter, one number and one special character',
      code: 400,
    };
  }
  User.create({
    DisplayName: displayName,
    FirstName: firstName,
    LastName: lastName,
    Email: email,
    Password: password,
  }).then((resultData) => {
    const { UserId, DisplayName, FirstName, LastName, Email } = resultData;
    const userData = {
      userId: UserId,
      email: Email,
      displayName: DisplayName,
      firstName: FirstName,
      lastName: LastName,
    };
    return userData;
  });
};

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

const findUserByEmail = (email) => User.findOne({ where: { Email: email } }).then((user) => user);

const userPasswordValid = (passwordToCheck, correctPassword) =>
  User.prototype.validPassword(passwordToCheck, correctPassword);

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

const dbUpdatePassword = (user, newPassword) => user.update({ Password: newPassword });

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

module.exports = {
  createUser,
  findUserByEmail,
  userPasswordValid,
  sendPasswordReset,
  findUserByResetToken,
  updatePasswordViaToken,
  dbUpdatePassword,
  deleteUserByEmail,
};
