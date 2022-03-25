const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const multer = require('multer');
const sessionMiddleware = require('./config/storeConfig');
const { errorLogger, errorResponder, failSafeHandler } = require('./middleware/errorHandler');

// Routers
const userRouter = require('./routes/userRouter');
const bookRouter = require('./routes/bookRouter');
const quoteRouter = require('./routes/quoteRouter');

const app = express();

const root = path.join(__dirname, 'build');
const upload = multer();

// app.set("trust proxy", 1);
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'https: data:', 'books.google.com'],
    },
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(sessionMiddleware);
app.use(
  cors({
    optionsSuccessStatus: 200,
    origin: process.env.NODE_ENV === 'production' ? process.env.PROD_ORIGIN : process.env.DEV_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
    credentials: true,
  })
);

// Uses routes defined in usersRouter alongside /users
// Example: /users/sign-up, /users/sign-in
app.use('/api/users', userRouter);

// Uses routes defined in booksRouter alongside /books
// Example: /books/, /books/book-search
app.use('/api/books', bookRouter);

// Uses routes defined in quotesRouter alongside /quotes
// Example: /quotes/, /quotes/get-random-qoute
app.use('/api/quotes', quoteRouter);

// Middlewares that are only used in production.
if (process.env.NODE_ENV === 'production') {
  // use the route to client index to handle non API routes.
  app.use(express.static(root));
  app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
} else {
  app.use('/*', () => {
    throw { message: 'Error 404, path does not exist', code: 404 };
  });
}

// Uses Error handlers
app.use(errorLogger);
app.use(errorResponder);
app.use(failSafeHandler);

module.exports = app;
