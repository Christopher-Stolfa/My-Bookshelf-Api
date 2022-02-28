import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { redisMiddleware } from "./Config/redisConfig.js";

// Error handlers
import {
  errorLogger,
  errorResponder,
  failSafeHandler,
} from "./Middleware/errorHandler.js";

// Routers
import usersRouter from "./Routes/users.routes.js";
import booksRouter from "./Routes/books.routes.js";
import quotesRouter from "./Routes/quotes.routes.js";
import sequelize from "./Config/databaseConfig.js";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(redisMiddleware);

// Uses routes defined in usersRouter alongside /users
// Example: /users/sign-up, /users/sign-in
app.use("/users", usersRouter);

// Uses routes defined in booksRouter alongside /books
// Example: /books/, /books/book-search
app.use("/books", booksRouter);

// Uses routes defined in quotesRouter alongside /quotes
// Example: /quotes/, /quotes/get-random-qoute
app.use("/quotes", quotesRouter);

// Uses Error handlers
app.use(errorLogger);
app.use(errorResponder);
app.use(failSafeHandler);

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
