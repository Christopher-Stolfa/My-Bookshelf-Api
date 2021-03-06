import { searchBooks, searchBookById } from '../Services/googlebooks.services.js';
import {
  dbGetFavoritedBook,
  dbSaveFavoritedBook,
  dbRemoveFavoritedBook,
  dbGetFavoritedBooks,
  dbSaveNote,
  dbEditNote,
  dbDeleteNote,
  dbGetNotes,
  dbToggleReadingBook,
  dbSetBookProgress,
} from '../Services/books.services.js';

// Searches for books via google books api
const bookSearch = async (req, res, next) => {
  const { searchQuery, filters } = JSON.parse(req.query.data);
  try {
    const { items } = await searchBooks(searchQuery, filters);
    res.status(200).json({
      message: 'Search successful',
      searchResultBooks: items,
    });
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

const bookSearchById = async (req, res) => {
  const { googleBooksId } = JSON.parse(req.query.data);
  try {
    const { item } = await searchBookById(googleBooksId);
    res.status(200).json({
      message: 'Search successful',
      selectedBook: item,
    });
  } catch (error) {
    res.status(200).json({
      message: 'Book does not exist',
      selectedBook: {},
    });
  }
};

const getUserFavorites = async (req, res, next) => {
  if (req.session.user) {
    try {
      const favorites = await dbGetFavoritedBooks(req.session.user.userId);
      res.status(200).json({
        message: 'Favorites found',
        favorites,
      });
    } catch (error) {
      error.message = 'Failed get user favorites';
      next(error);
    }
  } else {
    res.status(200).json({
      message: 'No favorites',
      favorites: [],
    });
  }
};

const saveFavoritedBook = async (req, res, next) => {
  try {
    if (!req.session.user) throw { message: 'Invalid credentials', code: 401 };
    const bookData = JSON.parse(req.body.data);
    const userId = req.session.user.userId;
    const favoritedBook = await dbSaveFavoritedBook(userId, bookData);
    res.status(201).json({
      message: 'Added to favorites',
      favoritedBook,
    });
  } catch (error) {
    next(error);
  }
};

const removeFavoritedBook = async (req, res, next) => {
  try {
    if (!req.session.user) throw { message: 'Invalid credentials', code: 401 };
    const bookData = JSON.parse(req.body.bookData);
    const userId = req.session.user.userId;
    const favoritedBook = await dbRemoveFavoritedBook(userId, bookData);
    res.status(201).json({
      message: 'Removed from favorites',
      favoritedBook,
    });
  } catch (error) {
    next(error);
  }
};

const getFavoritedBook = async (req, res, next) => {
  try {
    if (!req.session.user) throw { message: 'Invalid credentials', code: 401 };
    const { bookId } = JSON.parse(req.query.data);
    const userId = req.session.user.userId;
    const book = await dbGetFavoritedBook(userId, bookId);
    res.status(201).json({
      message: 'Favorited book found',
      book,
    });
  } catch (error) {
    next(error);
  }
};

const saveNote = async (req, res, next) => {
  try {
    if (!req.session.user) throw { message: 'Invalid credentials', code: 401 };
    const userId = req.session.user.userId;
    const { googleBooksId, noteText } = JSON.parse(req.body.data);
    const noteData = await dbSaveNote(userId, googleBooksId, noteText);
    res.status(200).json({ message: 'Note added', noteData });
  } catch (error) {
    next(error);
  }
};

const editNote = async (req, res, next) => {
  try {
    if (!req.session.user) throw { message: 'Invalid credentials', code: 401 };
    const bodyData = JSON.parse(req.body.data);
    const { noteId, noteText } = bodyData;
    const userId = req.session.user.userId;
    const noteData = await dbEditNote(userId, noteId, noteText);
    res.status(200).json({ message: 'Note saved', noteData });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    if (!req.session.user) throw { message: 'Invalid credentials', code: 401 };
    const userId = req.session.user.userId;
    const noteId = req.body.noteId;
    await dbDeleteNote(userId, noteId);
    res.status(200).json({ message: 'Note removed', noteId });
  } catch (error) {
    next(error);
  }
};

const getNotes = async (req, res, next) => {
  try {
    if (!req.session.user) throw { message: 'Invalid credentials', code: 401 };
    const userId = req.session.user.userId;
    const { googleBooksId } = JSON.parse(req.query.data);
    const notes = await dbGetNotes(userId, googleBooksId);
    res.status(200).json({ message: 'Successfully received notes', notes });
  } catch (error) {
    next(error);
  }
};

const toggleReadingBook = async (req, res, next) => {
  try {
    if (!req.session.user) throw { message: 'Invalid credentials', code: 401 };
    const bodyData = JSON.parse(req.body.data);
    const { googleBooksId, isReading, progress } = bodyData;
    const userId = req.session.user.userId;
    const bookData = await dbToggleReadingBook(userId, googleBooksId, isReading, progress);
    res.status(200).json({
      message: isReading ? 'Book set to reading' : 'Book set to not reading',
      bookData,
    });
  } catch (error) {
    next(error);
  }
};

const setBookProgress = async (req, res, next) => {
  try {
    if (!req.session.user) throw { message: 'Invalid credentials', code: 401 };
    const bodyData = JSON.parse(req.body.data);
    const { googleBooksId, progress } = bodyData;
    const userId = req.session.user.userId;
    const bookData = await dbSetBookProgress(userId, googleBooksId, progress);
    res.status(200).json({ message: `Progress set to ${progress}%`, bookData });
  } catch (error) {
    next(error);
  }
};

export {
  bookSearch,
  bookSearchById,
  getUserFavorites,
  saveFavoritedBook,
  removeFavoritedBook,
  saveNote,
  editNote,
  deleteNote,
  getNotes,
  getFavoritedBook,
  toggleReadingBook,
  setBookProgress,
};
