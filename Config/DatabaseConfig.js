const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.MYSQL_DB_NAME,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.SERVER_IP,
  }
);

module.exports = sequelize;
