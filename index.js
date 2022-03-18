require('dotenv/config');
const sequelize = require('./src/Config/dbConfig');
const app = require('./src/app');

app.listen(process.env.NODE_PORT || 5000, async () => {
  await sequelize.authenticate();
  console.log('Server is now running.');
});
