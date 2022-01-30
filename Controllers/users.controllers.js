const {
  createUser,
  findUserByEmail,
  userPasswordValid,
  saveFavoritedBook,
  getFavoritedBooks,
  removeFavoritedBook,
} = require("../Services/user.services");

const userSaveFavoritedBook = async (req, res, next) => {
  if (req.session.user) {
    try {
      const bookData = JSON.parse(req.body.data);
      const userId = req.session.user.userId;
      const favoritedBook = await saveFavoritedBook(userId, bookData);
      res.status(201).json({
        message: "Added to favorites",
        favoritedBook,
      });
    } catch (error) {
      next(error);
    }
  } else {
    res.redirect("/");
  }
};

const userRemoveFavoritedBook = async (req, res, next) => {
  if (req.session.user) {
    try {
      const bookData = JSON.parse(req.body.bookData);
      const userId = req.session.user.userId;
      const favoritedBook = await removeFavoritedBook(userId, bookData);
      res.status(201).json({
        message: "Removed from favorites",
        favoritedBook,
      });
    } catch (error) {
      next(error);
    }
  }
};

const userSignUp = async (req, res, next) => {
  const bodyData = JSON.parse(req.body.data);
  try {
    const userData = await createUser(bodyData);
    req.session.user = userData;
    res.status(201).json({
      message: "Account successfully created",
      loggedIn: true,
      userData: userData,
      favorites: [],
    });
  } catch (err) {
    next(error);
  }
};

const userCheckSession = async (req, res) => {
  if (req.session.user) {
    const favorites = await getFavoritedBooks(req.session.user.userId);
    res.status(200).json({
      message: "Login session exists",
      loggedIn: true,
      userData: req.session.user,
      favorites,
    });
  } else {
    res.status(200).json({
      message: "No session exists",
      loggedIn: false,
    });
  }
};

const userSignIn = async (req, res, next) => {
  const bodyData = JSON.parse(req.body.data);
  const { email, password } = bodyData;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      throw { message: "Invalid email or password", code: 401 };
    } else {
      const { UserId, Email, DisplayName, FirstName, LastName, Password } =
        user.toJSON();
      const passwordValid = userPasswordValid(password, Password);
      if (!passwordValid) {
        throw { message: "Invalid email or password", code: 401 };
      } else {
        const favorites = await getFavoritedBooks(UserId);
        const userData = {
          userId: UserId,
          email: Email,
          displayName: DisplayName,
          firstName: FirstName,
          lastName: LastName,
        };
        req.session.user = userData;
        res.status(200).json({
          message: "Sign in successful",
          loggedIn: true,
          userData: userData,
          favorites,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

const userSignOut = (req, res, next) => {
  if (req.session.user) {
    req.session.destroy((error) => {
      if (error) {
        throw { message: "Failed to sign out", code: 400 };
      } else {
        res.clearCookie("user-session").status(200).json({
          message: "Sign out successful",
          loggedIn: false,
        });
      }
    });
  } else {
    res.status(200).json({ message: "No session exists", loggedIn: false });
  }
};

module.exports = {
  userSignUp,
  userSignIn,
  userSignOut,
  userCheckSession,
  userSaveFavoritedBook,
  userRemoveFavoritedBook,
};
