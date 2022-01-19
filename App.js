require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const redis = require("redis");
const session = require("express-session");
let RedisStore = require("connect-redis")(session);
const usersRouter = require("./Routes/users.routes");
const booksRouter = require("./Routes/books.routes");
const sequelize = require("./Config/databaseConfig");

const app = express();
const PORT = 3001;

const SessionExpiration = 24 * 60 * 60 * 1000;

let redisClient = redis.createClient({
  host: process.env.SERVER_IP,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("error", (err) => {
  console.log("Error " + err);
});

app.use(express.json());
app.use(
  cors({
    origin: [process.env.LOCALHOST_CLIENT_ORIGIN],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
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
      expires: SessionExpiration,
    },
  })
);

// Uses routes defined in usersRouter alongside /users
// Example: /users/sign-up, /users/sign-in
app.use("/users", usersRouter);

// Uses routes defined in booksRouter alongside /books
// Example: /books/, /books/book-search
app.use("/books", booksRouter);

// Checks the database for the Model Schemas and creates tables for them if they don't exist.
sequelize
  .sync()
  .then((result) => {
    console.log("Synced Schemas");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
