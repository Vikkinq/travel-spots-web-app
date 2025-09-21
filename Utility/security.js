// middlewares/security.js
const helmet = require("helmet");

module.exports = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.maptiler.com", "https://cdn.jsdelivr.net"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.maptiler.com", "https://cdn.jsdelivr.net"],
    imgSrc: [
      "'self'",
      "data:",
      "https://api.maptiler.com",
      "https://cdn.maptiler.com",
      "https://res.cloudinary.com/dlk5ofxtb/",
    ],
    connectSrc: [
      "'self'",
      "https://api.maptiler.com",
      "https://cdn.maptiler.com",
      "https://res.cloudinary.com/dlk5ofxtb/",
      "https://cdn.jsdelivr.net",
    ],
    fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
    objectSrc: ["'none'"],

    // 👇 Add these for MapTiler workers
    workerSrc: ["'self'", "blob:"],
    childSrc: ["'self'", "blob:"],

    upgradeInsecureRequests: [],
  },
});
