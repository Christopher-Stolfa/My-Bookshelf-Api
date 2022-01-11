const express = require("express");
const router = express.Router();
const userControllers = require("../Controllers/users.controllers");

router.post("/sign-out", userControllers.userSignOut);
router.post("/sign-up", userControllers.userSignUp);
router.post("/sign-in", userControllers.userSignIn);
router.get("/check-session", userControllers.userCheckSession);
// router.get("/me");

module.exports = router;
