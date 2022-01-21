const moment = require("moment");
const { redisClient } = require("../Config/redisConfig");

const MAX_WINDOW_REQUEST_COUNT = 1;

const WINDOW_DURATION_IN_SECONDS = 2;
const WINDOW_LOG_DURATION_IN_SECONDS = 1;

const rateLimiter = (req, res, next) => {
  try {
    // Checks if the Redis client is present
    if (!redisClient) {
      console.log(redisClient);
      process.exit(1);
    }
    // Gets the records of the current user base on the IP address, returns a null if no user found
    redisClient.get(req.ip, (error, record) => {
      if (error) throw error;
      const currentTime = moment();
      // When there is no user record then a new record is created for the user and stored in the Redis storage
      if (record === null) {
        const newRecord = [
          {
            requestTimeStamp: currentTime.unix(),
            requestCount: 1
          }
        ];
        redisClient.set(req.ip, JSON.stringify(newRecord));
        next();
      }
      // When the record is found then its value is parsed and the number of requests the user has made within the last window is calculated
      let data = JSON.parse(record);
      const windowBeginTimestamp = moment()
        .subtract(WINDOW_DURATION_IN_SECONDS, "seconds")
        .unix();
      const requestsinWindow = data.filter(
        entry => entry.requestTimeStamp > windowBeginTimestamp
      );
      const totalWindowRequestsCount = requestsinWindow.reduce(
        (accumulator, entry) => accumulator + entry.requestCount,
        0
      );
      // if maximum number of requests is exceeded then an error is returned
      if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
        error = new Error("Too many requests");
        error.code = 429;
        next(error);
      } else {
        // When the number of requests made are less than the maximum the a new entry is logged
        let lastRequestLog = data[data.length - 1];
        const potentialCurrentWindowIntervalStartTimeStamp = currentTime
          .subtract(WINDOW_LOG_DURATION_IN_SECONDS, "seconds")
          .unix();
        // When the interval has not passed from the last request, then the counter increments
        if (
          lastRequestLog.requestTimeStamp >
          potentialCurrentWindowIntervalStartTimeStamp
        ) {
          lastRequestLog.requestCount++;
          data[data.length - 1] = lastRequestLog;
        } else {
          // When the interval has passed, a new entry for current user and timestamp is logged
          data = [
            ...data,
            {
              requestTimeStamp: currentTime.unix(),
              requestCount: 1
            }
          ];
        }
        redisClient.set(req.ip, JSON.stringify(data));
        next();
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = rateLimiter;
