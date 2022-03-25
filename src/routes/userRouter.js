const express = require('express');
const {
  userSignUp,
  userSignIn,
  userSignOut,
  userCheckSession,
  userForgotPassword,
  userCheckResetToken,
  updatePasswordWithToken,
  updatePassword,
} = require('../controllers/userController');
const {
  SIGN_OUT,
  SIGN_UP,
  SIGN_IN,
  CHECK_SESSION,
  CHECK_RESET_TOKEN,
  FORGOT_PASSWORD,
  UPDATE_PASSWORD_WITH_TOKEN,
  UPDATE_PASSWORD,
} = require('../constants/usersRoutes');
const router = express.Router();

router.post(SIGN_OUT, userSignOut);
router.post(SIGN_UP, userSignUp);
router.post(SIGN_IN, userSignIn);
router.post(FORGOT_PASSWORD, userForgotPassword);
router.put(UPDATE_PASSWORD_WITH_TOKEN, updatePasswordWithToken);
router.put(UPDATE_PASSWORD, updatePassword);
router.get(CHECK_SESSION, userCheckSession);
router.get(CHECK_RESET_TOKEN, userCheckResetToken);

module.exports = router;
