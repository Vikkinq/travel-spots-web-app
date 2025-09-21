const TravelSpot = require("../models/travelSpot");
const Review = require("../models/review");

// Creates new Review
module.exports.createReview = async (req, res, next) => {
  try {
    const spots = await TravelSpot.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    spots.reviews.push(review);
    await review.save();
    await spots.save();
    req.flash("success", "Successfully created a new Review");
    res.redirect(`/travelspots/${spots._id}`);
  } catch (err) {
    next(err);
  }
};

// Deletes Specific Review
module.exports.deleteReview = async (req, res, next) => {
  const { id, review_id } = req.params;
  await TravelSpot.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
  await Review.findByIdAndDelete(review_id);
  req.flash("success", "Successfully deleted Review");
  res.redirect(`/travelspots/${id}`);
};
