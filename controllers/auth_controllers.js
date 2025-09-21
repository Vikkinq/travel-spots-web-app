const User = require("../models/user_schema");

// Register
module.exports.registerForm = (req, res, next) => {
  res.render("authentication/register");
};

module.exports.postRegister = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const newUser = await User({ email, username });
    const registered_user = await User.register(newUser, password);
    req.login(registered_user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Travel Spot!");
      res.redirect("/travelspots");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("register");
  }
};

// Login
module.exports.loginForm = (req, res) => {
  res.render("authentication/login");
};

module.exports.postLogin = (req, res, next) => {
  try {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/travelspots";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  } catch (err) {
    next(err);
  }
};

// Logout
module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/travelspots");
  });
};
