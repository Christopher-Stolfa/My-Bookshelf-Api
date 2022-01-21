const redis = require("redis");

const redisClient = redis.createClient({
  host: process.env.SERVER_IP,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

redisClient.on("error", err => {
  console.error("Redis error:", err);
});

redisClient.on("reconnecting", () => {
  console.log("Reconnecting");
});

module.exports = { redisClient };
