if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Node / Express Packages
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const sessions = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const mongoSanitize = require("./Utility/mongoSanitizeV5");

// Model
const User = require("./models/user_schema");

// Error Handler File Path
const ExpressError = require("./Utility/AppError");
const security = require("./Utility/security");

// Routes
const travel_ground = require("./routes/travel-spots");
const review_route = require("./routes/review-route");
const auth_route = require("./routes/authentication");
const MongoStore = require("connect-mongo");

// MongoDB Connect via Mongoose
const local_mongo = "mongodb://127.0.0.1:27017/travelgrounds";
const mongo_url = process.env.MONGO_ATLAS || "mongodb://127.0.0.1:27017/travelgrounds";
main().catch((err) => console.log("Error Connection", err));

// mongo_atlas
async function main() {
  await mongoose.connect(mongo_url);
  console.log("DB CONNECTED!");
}

// using express via app
const app = express();

app.set("query parser", "extended");

// Main Logic for the Server Routes etc.
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(security);
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

// HTTP Formats
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const secret = process.env.SECRET || "secretkey";

const sessionConfig = {
  secret, // keep this in process.env in production
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: mongo_url,
    ttl: 14 * 24 * 60 * 60, // 14 days
  }),
  cookie: {
    httpOnly: true, // good security practice
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

// Flash and Session Logic
app.use(sessions(sessionConfig));
app.use(flash());

// Passport Logic (Passport.Session must be after SessionConfig)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Server Routers
app.use("/travelspots", auth_route);
app.use("/travelspots", travel_ground);
app.use("/travelspots/:id/reviews", review_route);

app.get("/", (req, res) => {
  res.render("home");
});

//----------------
// Error Handlers
//----------------

// No Path Error Handler
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Data Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no! Something Went Wrong!!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Serving on port ${port}`);
});
