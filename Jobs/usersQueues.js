const Queue = require("bull");
const {
  SIGN_OUT,
  SIGN_UP,
  SIGN_IN,
  CHECK_SESSION,
  SAVE_FAVORITED_BOOK,
  REMOVED_FAVORITED_BOOK,
} = require("../Constants/usersRoutes");

const { SERVER_IP, REDIS_PORT, REDIS_PASSWORD } = process.env;
const redisConfig = {
  redis: {
    port: REDIS_PORT,
    host: SERVER_IP,
    password: REDIS_PASSWORD,
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: 1000,
    },
  },
};
const signOutQueue = new Queue(SIGN_OUT, redisConfig);
const signUpQueue = new Queue(SIGN_UP, redisConfig);
const signInQueue = new Queue(SIGN_IN, redisConfig);
const checkSessionQueue = new Queue(CHECK_SESSION, redisConfig);
const saveFavoritedBookQueue = new Queue(SAVE_FAVORITED_BOOK, redisConfig);
const removeFavoritedBookQueue = new Queue(REMOVED_FAVORITED_BOOK, redisConfig);

module.exports = {
  signOutQueue,
  signUpQueue,
  signInQueue,
  checkSessionQueue,
  saveFavoritedBookQueue,
  removeFavoritedBookQueue,
};
