const googleBooks = require("../Services/googleBooks.services");

const bookSearch = async (req, res) => {
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
      message: "Search successful.",
      bookSearchData,
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
      bookSearchData: [],
    });
  }
};

module.exports = { bookSearch };
