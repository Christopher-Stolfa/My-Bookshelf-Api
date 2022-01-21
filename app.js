require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);

// Error Handlers
const {
  errorLogger,
  errorResponder,
  failSafeHandler
} = require("./Middleware/errorHandler");
const rateLimiter = require("./Middleware/rateLimiter");

// Routers
const usersRouter = require("./Routes/users.routes");
const booksRouter = require("./Routes/books.routes");
const sequelize = require("./Config/databaseConfig");

const { redisClient } = require("./Config/redisConfig");

const SessionExpiration = 24 * 60 * 60 * 1000;

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(
  cors({
    origin: [process.env.LOCALHOST_CLIENT_ORIGIN],
    methods: ["GET", "POST", "DELETE"],
    credentials: true
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "user-session",
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: {
      expires: SessionExpiration
    }
  })
);

// Limits the amount of requests within a specified amount of time
app.use(rateLimiter);
// Uses routes defined in usersRouter alongside /users
// Example: /users/sign-up, /users/sign-in
app.use("/users", usersRouter);

// Uses routes defined in booksRouter alongside /books
// Example: /books/, /books/book-search
app.use("/books", booksRouter);

// Uses Error handlers
app.use(errorLogger);
app.use(errorResponder);
app.use(failSafeHandler);

// Checks the database for the Model Schemas and creates tables for them if they don't exist.
sequelize
  .sync()
  .then(result => {
    console.log("Synced Schemas");
  })
  .catch(err => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
