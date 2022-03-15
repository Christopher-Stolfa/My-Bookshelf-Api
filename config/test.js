module.exports = {
  database: {
    username: process.env.TEST_MYSQL_USERNAME,
    password: process.env.TEST_MYSQL_PASSWORD,
    database: process.env.TEST_MYSQL_DB_NAME,
    host: process.env.TEST_MYSQL_HOST,
    dialect: 'mysql',
    logging: false,
  },
};
