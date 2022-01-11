require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");

const sequelize = require("./Config/databaseConfig");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const googleBooksTests = require("./Tests/googleBooksTests");

const SessionExpiration = 24 * 60 * 60 * 1000;

const myStore = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: SessionExpiration
});

const usersRouter = require("./Routes/users.routes");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(
  cors({
    origin: [process.env.LOCALHOST_CLIENT_ORIGIN],
    methods: ["GET", "POST"],
    credentials: true
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "user-session",
    secret: process.env.SESSION_SECRET,
    store: myStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: SessionExpiration
    }
  })
);

// Uses routes defined in usersRouter alongside /users
// Example: /users/signup, /users/signin
app.use("/users", usersRouter);

// Checks the database for the Model Schemas and creates tables for them if they don't exist.
sequelize
  .sync()
  .then(result => {
    console.log("Synced Schemas");
  })
  .catch(err => {
    console.log(err);
  });

myStore.sync();

// Runs tests on the google books api
// googleBooksTests();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
