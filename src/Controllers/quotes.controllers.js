import { getRandomQuote } from "../Services/quotes.services.js";

const randomQuote = (req, res, next) => {
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

export { randomQuote };
