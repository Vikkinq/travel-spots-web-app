const express = require("express");
const router = express.Router({ mergeParams: true });
const review_controller = require("../controllers/reviews_controller");

// Middleware
const { validateReview, isLoggedIn, isReviewAuthor } = require("../Utility/middleware");

// Review Routes

// Creates and Posts a Review on a Specific Spot
router.post("/", isLoggedIn, validateReview, review_controller.createReview);

// Deletes a Review on a Specific Spot
router.delete("/:review_id", isLoggedIn, isReviewAuthor, review_controller.deleteReview);

module.exports = router;
