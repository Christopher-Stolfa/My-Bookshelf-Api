require("dotenv").config();
const axios = require("axios");

const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
const googleVolumesUri = "https://www.googleapis.com/books/v1/volumes";

const searchBooks = (query, maxResults, startIndex, orderBy) => {
  const url = `${googleVolumesUri}?q=${query}&maxResults=${maxResults}&orderBy=${orderBy}&startIndex=${startIndex}&key=${apiKey}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(({ data }) => {
        resolve({
          items: data.items
            ? data.items.map(
                ({
                  id,
                  volumeInfo: {
                    title = "",
                    description = "",
                    authors = [],
                    publisher = "",
                    publishedDate = "",
                    pageCount = -1,
                    averageRating = -1,
                    ratingsCount = -1,
                    imageLinks,
                    language = "",
                    categories = [],
                  },
                }) => ({
                  googleBooksId: id,
                  title,
                  description,
                  authors,
                  publisher,
                  publishedDate,
                  pageCount,
                  averageRating,
                  ratingsCount,
                  imageLink: imageLinks?.thumbnail ?? "",
                  language,
                  categories,
                })
              )
            : [],
          totalItems: data.totalItems,
        });
      })
      .catch((error) => reject(error));
  });
};

const searchBookById = (googleBooksId) => {
  const url = `${googleVolumesUri}/${googleBooksId}?key=${apiKey}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(
        ({
          data: {
            id,
            volumeInfo: {
              title = "",
              description = "",
              authors = [],
              publisher = "",
              publishedDate = "",
              pageCount = -1,
              averageRating = -1,
              ratingsCount = -1,
              imageLinks,
              language = "",
              categories = [],
            },
          },
        }) => {
          resolve({
            item: {
              googleBooksId: id,
              title,
              description,
              authors,
              publisher,
              publishedDate,
              pageCount,
              averageRating,
              ratingsCount,
              imageLink: imageLinks?.thumbnail ?? "",
              language,
              categories,
            },
          });
        }
      )
      .catch((error) => reject(error));
  });
};

module.exports = {
  searchBooks,
  searchBookById,
};
