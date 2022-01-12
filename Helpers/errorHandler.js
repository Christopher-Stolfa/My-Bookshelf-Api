const getErrors = err => {
  let message = "";
  err.errors.forEach(error => {
    message += error.message;
    message += "\n";
  });
  return message;
};

module.exports = { getErrors };
