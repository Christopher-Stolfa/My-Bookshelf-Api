require("dotenv").config();
const axios = require("axios");

const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

const searchBooks = (query, maxResults, startIndex) => {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}&startIndex=${startIndex}&key=${apiKey}`;
  axios
    .get(url)
    .then(res => {
      if (startIndex >= res.data.totalItems || startIndex < 1) {
        console.log(`max reults must be between 1 and ${res.data.totalItems}`);
      } else {
        for (let i = 0; i < res.data.items.length; i++) {
          console.log(res.data.items[i]);
        }
        console.log(res.data.totalItems);
      }
    })
    .catch(err => {
      console.log(err.response);
    });
};

module.exports = {
  searchBooks
};
