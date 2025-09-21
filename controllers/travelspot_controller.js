const TravelSpot = require("../models/travelSpot");
const ExpressError = require("../Utility/AppError");
const cloudinary = require("cloudinary");
// const maptiler = require("@maptiler/sdk");

const { geocoding, config } = require("@maptiler/client");
config.apiKey = process.env.MAP_TILER_KEY; // set once globally

// Index Read All Data
module.exports.index = async (req, res) => {
  const page = req.query.p || 1;
  const spotsPerPage = req.query.limit || 10;
  const travelspots = await TravelSpot.find({})
    .skip((page - 1) * spotsPerPage)
    .limit(spotsPerPage);
  if (!travelspots) {
    throw new ExpressError("Cannot find data", 404);
  }
  res.render("travelspots/index", { travelspots });
};

// Create | Add
module.exports.new_form = (req, res) => {
  res.render("travelspots/create");
};

module.exports.create = async (req, res, next) => {
  try {
    const geoData = await geocoding.forward(`${req.body.travelspots.municipality}, ${req.body.travelspots.province}`, {
      limit: 1,
    });
    const newSpot = new TravelSpot(req.body.travelspots);
    newSpot.geometry = geoData.features[0].geometry;
    newSpot.images = req.files.map((i) => ({ url: i.path, filename: i.filename }));
    newSpot.author = req.user._id;
    await newSpot.save();
    console.log(newSpot);
    req.flash("success", "Successfully created a new Spot!");
    res.redirect(`/travelspots/${newSpot._id}`);
  } catch (err) {
    next(err);
  }
};

// Read or Show
module.exports.read = async (req, res, next) => {
  try {
    const { id } = req.params;
    const travelspots = await TravelSpot.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    if (!travelspots) {
      req.flash("error", "Could not find Spot");
      return res.redirect("/travelspots");
    }
    res.render("travelspots/show", { travelspots });
  } catch (err) {
    next(err);
  }
};

// Update
module.exports.update_form = async (req, res) => {
  const { id } = req.params;
  const travelspots = await TravelSpot.findById(id);
  if (!travelspots) {
    throw new ExpressError("Cannot find data", 404);
  }
  res.render("travelspots/update", { travelspots });
};

module.exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundSpot = await TravelSpot.findByIdAndUpdate(id, req.body.travelspots, {
      runValidators: true,
      new: true,
    });
    const imgs = req.files.map((i) => ({ url: i.path, filename: i.filename }));
    foundSpot.images.push(...imgs);
    await foundSpot.save();
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await foundSpot.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
      console.log("Deleted Images", req.body.deleteImages);
    }
    req.flash("success", "Successfully updated the Spot!");
    res.redirect(`/travelspots/${foundSpot._id}`);
  } catch (err) {
    next(err);
  }
};

// Delete
module.exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await TravelSpot.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted!");
    res.redirect("/travelspots");
  } catch (err) {
    next(err);
  }
};
