module.exports = {
  production: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    host: process.env.SERVER_IP,
    dialect: 'mysql',
  },
};
