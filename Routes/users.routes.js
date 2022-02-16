const express = require("express");
const router = express.Router();
const userControllers = require("../Controllers/users.controllers");
const {
  SIGN_OUT,
  SIGN_UP,
  SIGN_IN,
  CHECK_SESSION,
  CHECK_RESET_TOKEN,
  SAVE_FAVORITED_BOOK,
  REMOVED_FAVORITED_BOOK,
  GET_FAVORITED_BOOKS,
  FORGOT_PASSWORD,
  UPDATE_PASSWORD_WITH_TOKEN,
} = require("../Constants/usersRoutes");

router.post(SIGN_OUT, userControllers.userSignOut);
router.post(SIGN_UP, userControllers.userSignUp);
router.post(SIGN_IN, userControllers.userSignIn);
router.post(FORGOT_PASSWORD, userControllers.userForgotPassword);
router.put(UPDATE_PASSWORD_WITH_TOKEN, userControllers.updatePasswordWithToken);
router.get(CHECK_SESSION, userControllers.userCheckSession);
router.get(CHECK_RESET_TOKEN, userControllers.userCheckResetToken);

// User book routes
router.post(SAVE_FAVORITED_BOOK, userControllers.userSaveFavoritedBook);
router.delete(REMOVED_FAVORITED_BOOK, userControllers.userRemoveFavoritedBook);
router.get(GET_FAVORITED_BOOKS, userControllers.userGetFavorites);

module.exports = router;
