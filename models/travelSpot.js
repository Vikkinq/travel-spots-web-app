const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const travelSpotSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    description: {
      type: String,
      minlength: 10,
    },
    category: {
      type: String,
      enum: ["Beach", "Mountain", "Falls", "Historical", "City", "Island", "Farm", "Park", "Resort"],
    },
    province: {
      type: String,
      required: true,
    },
    municipality: {
      type: String,
      required: true,
    },
    images: [imageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        default: 0,
        required: true,
      }, // [lng, lat]
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts,
  {
    timestamps: true,
  }
);

travelSpotSchema.virtual("properties.popMarkup").get(function () {
  return `${this.title}`;
});

travelSpotSchema.virtual("location").get(function () {
  if (this.municipality && this.province) {
    return `${this.municipality}, ${this.province}`;
  } else if (this.province) {
    return this.province;
  } else {
    return "";
  }
});

travelSpotSchema.post("findOneAndDelete", async function (doc) {
  if (doc && doc.reviews?.length) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports = mongoose.model("TravelSpot", travelSpotSchema);
