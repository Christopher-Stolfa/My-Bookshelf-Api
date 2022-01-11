const getErrors = (err) => err.errors.map((error) => error.message);


module.exports = { getErrors };
