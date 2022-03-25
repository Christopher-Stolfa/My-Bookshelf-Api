/**
 * @description Configuration file for dynamically initializing a session data store depending on the environment
 * @module dbConfig
 */
const session = require('express-session');

const SESSION_EXPIRATION = 24 * 60 * 60 * 1000;

const sessionConfig = {
  key: 'user-session',
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: {
    expires: SESSION_EXPIRATION,
  },
};

if (process.env.NODE_ENV === 'production') {
  const redis = require('redis');
  const RedisStore = require('connect-redis')(session);
  const config = require('config');
  const storeConfig = config.get('dataStore');
  const redisClient = redis.createClient(storeConfig);

  sessionConfig.store = new RedisStore({ client: redisClient });
}

const sessionMiddleware = session(sessionConfig);

module.exports = sessionMiddleware;
