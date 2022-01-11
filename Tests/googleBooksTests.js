const googleBooksApi = require("../Services/googlebooks.services");

/**
 * func tests
 * Searches for books using google books api
 * Params: (query, maxResults, startIndex)
 * maxResults can't be over 40
 */

const tests = () => {
  googleBooksApi.searchBooks("The witcher", 5, 1);
};

module.exports = tests;
