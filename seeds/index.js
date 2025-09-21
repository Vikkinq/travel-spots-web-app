const mongoose = require("mongoose");
const TravelSpot = require("../models/travelSpot");

const spots = require("./seeds");

// MongoDB Connect via Mongoose
main().catch((err) => console.log("Error Connection", err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/travelgrounds");
  console.log("DB CONNECTED!");
}

const seedDB = async () => {
  try {
    await TravelSpot.deleteMany({});
    await TravelSpot.insertMany(spots);

    console.log(`Seeded ${spots.length} Travel Spots`);
  } catch (err) {
    console.error(`Seed Error: `, err);
  } finally {
    await mongoose.disconnect();
    console.log("DISCONNECTED!");
  }
};

seedDB();
