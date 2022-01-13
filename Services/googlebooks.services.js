require("dotenv").config();
const axios = require("axios");

const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
const googleVolumesUri = "https://www.googleapis.com/books/v1/volumes";

const searchBooks = (query, maxResults, startIndex) => {
  const url = `${googleVolumesUri}?q=${query}&maxResults=${maxResults}&startIndex=${startIndex}&key=${apiKey}`;
  return axios.get(url);
};

module.exports = {
  searchBooks
};
