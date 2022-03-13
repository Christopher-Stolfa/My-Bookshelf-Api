import 'dotenv/config';
import sequelize from './src/Config/databaseConfig.js';
import app from './src/app.js';

// Checks the database for the Model Schemas and creates tables for them if they don't exist.
sequelize
  .sync()
  .then(() => {
    console.log('Synced Schemas');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.NODE_PORT || 5000, () => {
  console.log('Server is now running.');
});
