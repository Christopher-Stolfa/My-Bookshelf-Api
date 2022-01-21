const errorLogger = (error, req, res, next) => {
  console.error(error); // or using any fancy logging library
  next(error); // forward to next middleware
};

const errorResponder = (error, req, res, next) => {
  if (error.code) {
    // responding to client
    res.status(error.code).json({ message: error.message.toString() });
  } else {
    // forwarding exceptional case to fail-safe middleware
    next(error);
  }
};

const failSafeHandler = (error, req, res, next) => {
  // generic handler
  res.status(500).json({ message: error.message.toString() });
};

module.exports = { errorLogger, errorResponder, failSafeHandler };
