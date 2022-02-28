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
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: {
    path: "/",
    httpOnly: true,
    domain: "localhost:3000",
    expires: SessionExpiration,
  },
});

const redisMiddleware = (req, res, next) => {
  let tries = 3;

  const lookupSession = (error) => {
    if (error) {
      return next(error);
    }

    tries -= 1;

    if (req.session !== undefined) {
      return next();
    }

    if (tries < 0) {
      return next(new Error("oh no"));
    }

    sessionMiddleware(req, res, lookupSession);
  };

  lookupSession();
};

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisClient.on("reconnecting", () => {
  console.log("Reconnecting");
});

export { redisClient, redisMiddleware };
