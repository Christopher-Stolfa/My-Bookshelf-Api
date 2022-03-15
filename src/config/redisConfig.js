const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const SessionExpiration = 24 * 60 * 60 * 1000;

const redisClient = redis.createClient({
  host: process.env.SERVER_IP,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

const sessionMiddleware = session({
  key: 'user-session',
  store: new RedisStore({ client: redisClient }),
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: {
    expires: SessionExpiration,
  },
});

module.exports = { redisClient, sessionMiddleware };
