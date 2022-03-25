/**
 * @description Configuration file for dynamically initializing a session data store depending on the environment
 * @module dbConfig
 */
const session = require('express-session');

/**
 * @type {number} - time a session should expire
 */
const SESSION_EXPIRATION = 24 * 60 * 60 * 1000;

/**
 * @description - session config object
 * @typedef sessionConfig
 * @type {object}
 * @property {string} key - key name of session
 * @property {boolean} saveUninitialized - defaults as true
 * @property {string} secret - session secret key, should be an env variable
 * @property {boolean} resave - defaults as false
 * @property {object} cookie - cookie options
 * @property {object} cookie.expires - expiration time for cookie
 */
const sessionConfig = {
  key: 'user-session',
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: {
    expires: SESSION_EXPIRATION,
  },
};

/**
 * @definition - if the environment is production, use redis as a data store
 */
if (process.env.NODE_ENV === 'production') {
  const redis = require('redis');
  const RedisStore = require('connect-redis')(session);
  const config = require('config');
  const storeConfig = config.get('dataStore');
  const redisClient = redis.createClient(storeConfig);

  sessionConfig.store = new RedisStore({ client: redisClient });
}

/**
 * @definition - session middleware that is instantiated with session config
 * @type {object}
 */
const sessionMiddleware = session(sessionConfig);

module.exports = sessionMiddleware;
