const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) return helpers.error("string.escapeHTML", { value });
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.validationSchema = Joi.object({
  travelspots: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0).default(0),
    province: Joi.string().required().escapeHTML(),
    municipality: Joi.string().required().escapeHTML(),
    description: Joi.string().min(10).required().escapeHTML(),
    category: Joi.string().required().escapeHTML(),
    // geometry: Joi.object({
    //   type: Joi.string().valid("Point").default('Point'),
    //   coordinates: Joi.array().items(Joi.number()).length(2).required(),
    // }),
    // image: Joi.string().uri().optional(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(0),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
