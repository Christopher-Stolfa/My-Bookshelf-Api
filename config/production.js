module.exports = {
  database: {
    username: process.env.PROD_MYSQL_USERNAME,
    password: process.env.PROD_MYSQL_PASSWORD,
    database: process.env.PROD_MYSQL_DB_NAME,
    host: process.env.PROD_MYSQL_HOST,
    dialect: 'mysql',
    logging: false,
  },
  dataStore: {
    host: process.env.PROD_STORAGE_HOST,
    password: process.env.PROD_STORAGE_PASSWORD,
    port: process.env.PROD_STORAGE_PORT,
  },
};