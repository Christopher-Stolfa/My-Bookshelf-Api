require("dotenv").config();
const axios = require("axios");

const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
const googleVolumesUri = "https://www.googleapis.com/books/v1/volumes";

const searchBooks = (query, maxResults, startIndex, orderBy) => {
  const url = `${googleVolumesUri}?q=${query}&maxResults=${maxResults}&orderBy=${orderBy}&startIndex=${startIndex}&key=${apiKey}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => {
        resolve(
          res.data.items.map(
            ({
              id,
              volumeInfo: {
                title = "",
                description = "",
                authors = [""],
                publisher = "",
                publishedDate = "",
                pageCount = -1,
                averageRating = -1,
                ratingsCount = -1,
                imageLinks = [""],
                language = "",
                categories = ["No information on this listing."]
              }
            }) => ({
              id,
              title,
              description,
              authors,
              publisher,
              publishedDate,
              pageCount,
              averageRating,
              ratingsCount,
              imageLinks,
              language,
              categories
            })
          )
        );
      })
      .catch(err => reject(err));
  });
};

module.exports = {
  searchBooks
};
