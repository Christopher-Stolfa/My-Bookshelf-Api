const quotesData = require('../data/quotesData.json');

const getRandomQuote = () => quotesData[Math.floor(Math.random() * quotesData.length)];

module.exports = { getRandomQuote };
