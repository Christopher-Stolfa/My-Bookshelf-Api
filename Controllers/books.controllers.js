const {
  searchBooks,
  searchBookById,
} = require("../Services/googleBooks.services");

const bookSearch = async (req, res, next) => {
  const { searchQuery, maxResults, startIndex, orderBy, currentPage } =
    JSON.parse(req.query.data);
  try {
    const { items, totalItems } = await searchBooks(
      searchQuery,
      maxResults,
      startIndex,
      orderBy
    );
    res.status(200).json({
      message: "Search successful",
      bookSearchData: items,
      totalItems,
      searchQuery,
      currentPage,
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
      bookSearchData: item,
    });
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

module.exports = { bookSearch, bookSearchById };
