const googleBooks = require("../Services/googleBooks.services");

/**
 * func tests
 * Searches for books using google books api
 * Params: (query, maxResults, startIndex)
 * maxResults can't be over 40
 */

const tests = () => {
  googleBooks.searchBooks("The witcher", 5, 1);
};

module.exports = tests;
