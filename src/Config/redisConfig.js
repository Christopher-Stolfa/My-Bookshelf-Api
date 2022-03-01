import redis from "redis";
import session from "express-session";
import RedisStore from "connect-redis";
const RedisStoreSession = RedisStore(session);

const SessionExpiration = 24 * 60 * 60 * 1000;

const redisClient = redis.createClient({
  host: process.env.SERVER_IP,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

const sessionMiddleware = session({
  key: "user-session",
  store: new RedisStoreSession({ client: redisClient }),
  proxy: true,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: {
    expires: SessionExpiration,
    secure: true,
    httpOnly: true,
  },
});

export { redisClient, sessionMiddleware };
