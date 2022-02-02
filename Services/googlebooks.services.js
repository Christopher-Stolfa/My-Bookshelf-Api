require("dotenv").config();
const axios = require("axios");

const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
const googleVolumesUri = "https://www.googleapis.com/books/v1/volumes";

const searchBooks = (query, orderBy) => {
  const url = `${googleVolumesUri}?q=${query}&maxResults=40&orderBy=${orderBy}&key=${apiKey}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(({ data: { items = [] } }) => {
        const itemsMap = items
          .filter(
            ({ volumeInfo }) =>
              (volumeInfo.title ||
                volumeInfo.categories.some(category =>
                  category.includes(query)
                )) &&
              volumeInfo.description &&
              volumeInfo.authors &&
              volumeInfo.publisher &&
              volumeInfo.publishedDate &&
              volumeInfo.pageCount &&
              volumeInfo.imageLinks &&
              volumeInfo.categories
          )
          .map(item => ({
            googleBooksId: item.id,
            title: item.volumeInfo.title,
            description: item.volumeInfo.description,
            authors: item.volumeInfo.authors,
            publisher: item.volumeInfo.publisher,
            publishedDate: item.volumeInfo.publishedDate,
            pageCount: item.volumeInfo.pageCount,
            averageRating: item.volumeInfo.averageRating || -1,
            ratingsCount: item.volumeInfo.ratingsCount || -1,
            imageLink: item.volumeInfo.imageLinks.thumbnail,
            language: item.volumeInfo.language || "",
            categories: item.volumeInfo.categories
          }));
        resolve({
          items: itemsMap
        });
      })
      .catch(error => reject(error));
  });
};

const searchBookById = googleBooksId => {
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
              categories = []
            }
          }
        }) => {
          resolve({
            item: {
              googleBooksId: id,
              title,
              description: description.replace(/(<([^>]+)>)/gi, " "),
              authors,
              publisher,
              publishedDate,
              pageCount,
              averageRating,
              ratingsCount,
              imageLink: imageLinks?.thumbnail ?? "",
              language,
              categories
            }
          });
        }
      )
      .catch(error => reject(error));
  });
};

module.exports = {
  searchBooks,
  searchBookById
};
