const { getRandomQoute } = require("../Services/quotes.services");

const randomQoute = (req, res, next) => {
  try {
    const quote = getRandomQoute();
    res.status(200).json({
      message: "Quote found success",
      selectedQuote: quote,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { randomQoute };
