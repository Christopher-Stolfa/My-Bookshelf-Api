/**
 * @description - Google books api services used by the controllers for business logic
 * @module services/googleBooksService
 */
const axios = require('axios');

const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
const googleVolumesUri = 'https://www.googleapis.com/books/v1/volumes';

const googleSearchBooks = (query, { searchBy }) => {
  const url = `${googleVolumesUri}?q=${searchBy}${query}&maxResults=40&orderBy=Relevance&key=${apiKey}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(({ data: { items = [] } }) => {
        const itemsMap = items
          .filter(
            ({ volumeInfo }) =>
              volumeInfo.title &&
              volumeInfo.description &&
              volumeInfo.authors &&
              volumeInfo.publisher &&
              volumeInfo.publishedDate &&
              volumeInfo.pageCount &&
              volumeInfo.imageLinks &&
              volumeInfo.categories
          )
          .map((item) => ({
            googleBooksId: item.id,
            title: item.volumeInfo.title,
            description: item.volumeInfo.description,
            authors: item.volumeInfo.authors,
            publisher: item.volumeInfo.publisher,
            publishedDate: item.volumeInfo.publishedDate,
            pageCount: item.volumeInfo.pageCount || -1,
            averageRating: item.volumeInfo.averageRating || -1,
            ratingsCount: item.volumeInfo.ratingsCount || -1,
            imageLink: item.volumeInfo.imageLinks.thumbnail.replace(/^http:\/\//i, 'https://'),
            language: item.volumeInfo.language,
            categories: item.volumeInfo.categories,
          }))
          .sort((a, b) => b.ratingsCount - a.ratingsCount);
        resolve({
          items: itemsMap,
        });
      })
      .catch((error) => reject(error));
  });
};

const googleSearchBookById = (googleBooksId) => {
  const url = `${googleVolumesUri}/${googleBooksId}?key=${apiKey}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(
        ({
          data: {
            id,
            volumeInfo: {
              title = '',
              description = '',
              authors = [],
              publisher = '',
              publishedDate = '',
              pageCount = -1,
              averageRating = -1,
              ratingsCount = -1,
              imageLinks,
              language = '',
              categories = [],
            },
          },
        }) => {
          const imageLink = imageLinks?.thumbnail ?? '';
          resolve({
            item: {
              googleBooksId: id,
              title,
              description: description.replace(/(<([^>]+)>)/gi, ' '),
              authors,
              publisher,
              publishedDate,
              pageCount,
              averageRating,
              ratingsCount,
              imageLink: imageLink.replace(/^http:\/\//i, 'https://'),
              language,
              categories,
            },
          });
        }
      )
      .catch((error) => reject(error));
  });
};

module.exports = { googleSearchBooks, googleSearchBookById };
