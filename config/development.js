module.exports = {
  development: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DEV_DB,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
  },
};
