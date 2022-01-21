const googleBooks = require("../Services/googleBooks.services");

const bookSearch = async (req, res, next) => {
  const { searchQuery, maxResults, startIndex, orderBy } = JSON.parse(
    req.query.data
  );
  try {
    const bookSearchData = await googleBooks.searchBooks(
      searchQuery,
      maxResults,
      startIndex,
      orderBy
    );
    res.status(200).json({
      message: "Search successful",
      bookSearchData
    });
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

module.exports = { bookSearch };
