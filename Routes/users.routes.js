const express = require("express");
const router = express.Router();
const userControllers = require("../Controllers/users.controllers");

// Auth routes
router.post("/sign-out", userControllers.userSignOut);
router.post("/sign-up", userControllers.userSignUp);
router.post("/sign-in", userControllers.userSignIn);
router.get("/check-session", userControllers.userCheckSession);

// User book routes
router.post("/save-favorited-book", userControllers.userSaveFavoritedBook);
router.delete(
  "/remove-favorited-book",
  userControllers.userRemoveFavoritedBook
);

module.exports = router;
