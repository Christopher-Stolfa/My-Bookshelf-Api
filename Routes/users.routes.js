const express = require("express");
const router = express.Router();
const userControllers = require("../Controllers/users.controllers");
const rateLimiter = require("../Middleware/rateLimiter");
const {
  SIGN_OUT,
  SIGN_UP,
  SIGN_IN,
  CHECK_SESSION,
  SAVE_FAVORITED_BOOK,
  REMOVED_FAVORITED_BOOK
} = require("../Constants/usersRoutes");

router.use(rateLimiter);
router.post(SIGN_OUT, userControllers.userSignOut);
router.post(SIGN_UP, userControllers.userSignUp);
router.post(SIGN_IN, userControllers.userSignIn);
router.get(CHECK_SESSION, userControllers.userCheckSession);

// User book routes
router.post(SAVE_FAVORITED_BOOK, userControllers.userSaveFavoritedBook);
router.delete(REMOVED_FAVORITED_BOOK, userControllers.userRemoveFavoritedBook);

module.exports = router;
