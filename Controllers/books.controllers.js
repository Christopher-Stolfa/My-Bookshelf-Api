const {
  searchBooks,
  searchBookById,
} = require("../Services/googleBooks.services");

const bookSearch = async (req, res, next) => {
  const { searchQuery, orderBy } = JSON.parse(req.query.data);
  try {
    const { items, totalItems } = await searchBooks(searchQuery, orderBy);
    res.status(200).json({
      message: "Search successful",
      bookSearchData: items,
      searchQuery,
    });
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

const bookSearchById = async (req, res, next) => {
  const { googleBooksId } = JSON.parse(req.query.data);
  try {
    const { item } = await searchBookById(googleBooksId);
    res.status(200).json({
      message: "Search successful",
      selectedBook: item,
    });
  } catch (error) {
    res.status(200).json({
      message: "Book does not exist",
      selectedBook: {},
    });
  }
};

module.exports = { bookSearch, bookSearchById };
