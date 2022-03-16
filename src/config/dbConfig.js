const Sequelize = require('sequelize');
const config = require('config');

const dbConfig = config.get('database');

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: false,
});

module.exports = sequelize;
