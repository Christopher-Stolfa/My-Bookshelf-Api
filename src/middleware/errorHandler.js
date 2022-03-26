/**
 * @description - Error handlers
 * @module middleware/errorHandler
 */

/**
 * @description - Logs errors
 * @function errorLogger
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorLogger = (error, req, res, next) => {
  console.error(error);
  next(error);
};

/**
 * @description - All errors from the controller are passed here
 * @function errorResponder
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorResponder = (error, req, res, next) => {
  if (error.code) {
    res.status(error.code).json({ message: error.message.toString() });
  } else {
    next(error);
  }
};

/**
 * @description - All errors without a status code are passed here
 * @function failSafeHandler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const failSafeHandler = (error, req, res) => {
  // generic error handler response
  res.status(500).json({ message: 'Server error' });
};

module.exports = { errorLogger, errorResponder, failSafeHandler };
