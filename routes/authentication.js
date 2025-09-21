const express = require("express");
const router = express.Router();
const auth_controller = require("../controllers/auth_controllers");

const passport = require("passport");
const { storeReturnTo } = require("../Utility/middleware");

// Register
router
  .route("/register")
  .get(auth_controller.registerForm) // Get
  .post(auth_controller.postRegister);

// Login
router
  .route("/login")
  .get(auth_controller.loginForm)
  .post(
    storeReturnTo,
    passport.authenticate("local", { failureFlash: true, failureRedirect: "/travelspots/login" }),
    auth_controller.postLogin
  );

// Logout
router.get("/logout", auth_controller.logout);

module.exports = router;
