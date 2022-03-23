module.exports = {
  database: {
    username: process.env.DEV_MYSQL_USERNAME,
    password: process.env.DEV_MYSQL_PASSWORD,
    database: process.env.DEV_MYSQL_DB_NAME,
    host: process.env.DEV_MYSQL_HOST,
    dialect: 'mysql',
    logging: false,
  },
  mail: {
    service: 'gmail',
    auth: {
      user: process.env.TRANSPORTER_EMAIL,
      pass: process.env.TRANSPORTER_PASSWORD,
    },
  },
  origin: process.env.DEV_ORIGIN,
};
