const TravelSpot = require("../models/travelSpot");
const ExpressError = require("../Utility/AppError");
const { validationSchema, reviewSchema } = require("./ValidationSchema");
const Review = require("../models/review");

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/travelspots/login");
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const spot = await TravelSpot.findById(id);
  if (!spot.author.equals(req.user._id)) {
    req.flash("error", "You don't have Permission to do that!");
    return res.redirect(`/travelspots/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, review_id } = req.params;
  const review = await Review.findById(review_id);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have Permission to do that!");
    return res.redirect(`/travelspots/${id}`);
  }
  next();
};

module.exports.validateSpot = (req, res, next) => {
  const { error } = validationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((er) => er.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  // If body is totally missing
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ExpressError('"review" is required', 400);
  }

  const { error } = reviewSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
