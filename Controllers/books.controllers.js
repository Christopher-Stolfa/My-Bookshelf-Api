const {
  searchBooks,
  searchBookById,
} = require("../Services/googleBooks.services");
const {
  dbSaveFavoritedBook,
  dbRemoveFavoritedBook,
  dbGetFavoritedBooks,
  dbSaveNote,
  dbEditNote,
  dbDeleteNote,
  dbGetNotes,
} = require("../Services/books.services");

const bookSearch = async (req, res, next) => {
  const { searchQuery, filters } = JSON.parse(req.query.data);
  try {
    const { items } = await searchBooks(searchQuery, filters);
    res.status(200).json({
      message: "Search successful",
      searchResultBooks: items,
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

const getUserFavorites = async (req, res, next) => {
  if (req.session.user) {
    try {
      const favorites = await dbGetFavoritedBooks(req.session.user.userId);
      res.status(200).json({
        message: "Favorites found",
        favorites,
      });
    } catch (error) {
      error.message = "Failed get user favorites";
      next(error);
    }
  } else {
    res.status(200).json({
      message: "No favorites",
      favorites: [],
    });
  }
};

const saveFavoritedBook = async (req, res, next) => {
  try {
    if (!req.session.user) throw { message: "Invalid credentials", code: 401 };
    const bookData = JSON.parse(req.body.data);
    const userId = req.session.user.userId;
    const favoritedBook = await dbSaveFavoritedBook(userId, bookData);
    res.status(201).json({
      message: "Added to favorites",
      favoritedBook,
    });
  } catch (error) {
    next(error);
  }
};

const removeFavoritedBook = async (req, res, next) => {
  try {
    if (!req.session.user) throw { message: "Invalid credentials", code: 401 };
    const bookData = JSON.parse(req.body.bookData);
    const userId = req.session.user.userId;
    const favoritedBook = await dbRemoveFavoritedBook(userId, bookData);
    res.status(201).json({
      message: "Removed from favorites",
      favoritedBook,
    });
  } catch (error) {
    next(error);
  }
};

const saveNote = async (req, res, next) => {
  try {
    if (!req.session.user) throw { message: "Invalid credentials", code: 401 };
    const userId = req.session.user.userId;
    const { googleBooksId, noteText } = JSON.parse(req.body.data);
    const noteData = await dbSaveNote(userId, googleBooksId, noteText);
    res.status(200).json({ message: "success", noteData });
  } catch (error) {
    next(error);
  }
};

const editNote = async (req, res, next) => {
  res.status(200).json({ message: "success" });
};

const deleteNote = async (req, res, next) => {
  res.status(200).json({ message: "success" });
};

const getNotes = async (req, res, next) => {
  res.status(200).json({ message: "success" });
};

module.exports = {
  bookSearch,
  bookSearchById,
  getUserFavorites,
  saveFavoritedBook,
  removeFavoritedBook,
  saveNote,
  editNote,
  deleteNote,
  getNotes,
};
