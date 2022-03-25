/**
 * @description Configuration file for dynamically initializing sequelize depending on the environment
 * @module dbConfig
 */
const Sequelize = require('sequelize');
const config = require('config');

/**
 * @description Database object from the config file
 * @typedef dbConfig
 * @type {object}
 * @property {string} username - username
 * @property {string} password - password
 * @property {string} database - database name
 * @property {string} host - host address
 * @property {string} dialect - query language dialect, most likely mySQL
 * @property {boolean} logging - option for if we want sequelize to print logs
 */
const dbConfig = config.get('database');

/**
 * @description
 * @type {Object} - Initialization of sequelize with database configuration params
 */
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
});

module.exports = sequelize;
