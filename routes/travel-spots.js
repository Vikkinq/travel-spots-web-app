const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthor, validateSpot } = require("../Utility/middleware");
const travel_spots = require("../controllers/travelspot_controller");
const { storage } = require("../cloudinary/cloudinary");

const multer = require("multer");
const upload = multer({ storage });

// router.use((req, res, next) => {
//   console.log("ROUTER PATH:", req.path);
//   console.log("PARAMS:", req.params);
//   next();
// });

// CRUD Routes

router.get("/", travel_spots.index);

// CREATE
router.get("/create", isLoggedIn, travel_spots.new_form);
router.post("/", isLoggedIn, upload.array("image"), validateSpot, travel_spots.create);

// READ
router.get("/:id", travel_spots.read);

// UPDATE
router.get("/:id/edit", isLoggedIn, isAuthor, travel_spots.update_form);
router.put("/:id", isLoggedIn, isAuthor, upload.array("image"), validateSpot, travel_spots.update);

// DELETE
router.delete("/:id", isLoggedIn, isAuthor, travel_spots.delete);

module.exports = router;
