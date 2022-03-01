import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { sessionMiddleware } from "./src/Config/redisConfig.js";

// Error handlers
import {
  errorLogger,
  errorResponder,
  failSafeHandler,
} from "./src/Middleware/errorHandler.js";

// Routers
import usersRouter from "./src/Routes/users.routes.js";
import booksRouter from "./src/Routes/books.routes.js";
import quotesRouter from "./src/Routes/quotes.routes.js";
import sequelize from "./src/Config/databaseConfig.js";

const app = express();
const PORT = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "build");

app.set("trust proxy", 1);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(
  cors({
    origin: [process.env.PROD_CLIENT, process.env.PROD_CLIENT_WWW],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// Uses routes defined in usersRouter alongside /users
// Example: /users/sign-up, /users/sign-in
app.use("/api/users", usersRouter);

// Uses routes defined in booksRouter alongside /books
// Example: /books/, /books/book-search
app.use("/api/books", booksRouter);

// Uses routes defined in quotesRouter alongside /quotes
// Example: /quotes/, /quotes/get-random-qoute
app.use("/api/quotes", quotesRouter);

app.use(express.static(root));

app.use("/*", (req, res) => {
  console.log("//var/www/html")
  res.sendFile("/var/www/html/index.html");
});

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
