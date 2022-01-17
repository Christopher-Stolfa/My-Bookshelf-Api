// TODO: Move congested business logic from users controllers into here.
const { reject } = require("bcrypt/promises");
const User = require("../Models/user");

const createUser = ({ displayName, firstName, lastName, email, password }) =>
  User.create({
    DisplayName: displayName,
    FirstName: firstName,
    LastName: lastName,
    Email: email,
    Password: password,
  }).then((resultData) => {
    const { UserId, DisplayName, FirstName, LastName, Email } =
      resultData.toJSON();
    const userData = {
      userId: UserId,
      email: Email,
      displayName: DisplayName,
      firstName: FirstName,
      lastName: LastName,
    };
    return userData;
  });

const findUser = (email) =>
  User.findOne({ where: { Email: email } }).then(
    (user = user.toJSON()) => user
  );

const userPasswordValid = (passwordToCheck, correctPassword) =>
  User.prototype.validPassword(passwordToCheck, correctPassword);

module.exports = {
  createUser,
  findUser,
  userPasswordValid,
};
