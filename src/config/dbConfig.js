/**
 * @description Configuration file for dynamically initializing sequelize depending on the environment
 * @module config/dbConfig
 */
const Sequelize = require('sequelize');
const config = require('config');

const dbConfig = config.get('database');

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
});

module.exports = sequelize;
