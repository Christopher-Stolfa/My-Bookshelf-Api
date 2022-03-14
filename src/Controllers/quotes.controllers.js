const { getRandomQuote } = require('../Services/quotes.services.js');

const randomQuote = (req, res, next) => {
  try {
    const quote = getRandomQuote();
    res.status(200).json({
      message: 'Quote found success',
      selectedQuote: quote,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { randomQuote };
