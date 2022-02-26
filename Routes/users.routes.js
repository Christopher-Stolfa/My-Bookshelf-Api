const express = require("express");
const router = express.Router();
const userControllers = require("../Controllers/users.controllers");
const {
  SIGN_OUT,
  SIGN_UP,
  SIGN_IN,
  CHECK_SESSION,
  CHECK_RESET_TOKEN,
  FORGOT_PASSWORD,
  UPDATE_PASSWORD_WITH_TOKEN,
  UPDATE_PASSWORD,
} = require("../Constants/usersRoutes");

router.post(SIGN_OUT, userControllers.userSignOut);
router.post(SIGN_UP, userControllers.userSignUp);
router.post(SIGN_IN, userControllers.userSignIn);
router.post(FORGOT_PASSWORD, userControllers.userForgotPassword);
router.put(UPDATE_PASSWORD_WITH_TOKEN, userControllers.updatePasswordWithToken);
router.put(UPDATE_PASSWORD, userControllers.updatePassword);
router.get(CHECK_SESSION, userControllers.userCheckSession);
router.get(CHECK_RESET_TOKEN, userControllers.userCheckResetToken);

module.exports = router;
