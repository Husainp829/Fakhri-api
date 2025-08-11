const joi = require("joi");

const type = joi.string().valid("RENT", "DEPOSIT");
const organiser = joi.string();
const organiserIts = joi.string().allow(null, "");

const amount = joi.number();
const mode = joi.string().allow(null, "");
const ref = joi.string().allow(null, "");

const bookingId = joi.string();

const body = {
  type: type.required(),
  organiser: organiser.required(),
  organiserIts: organiserIts.required(),
  bookingId: bookingId.required(),
  amount: amount.min(1).required(),
  mode: mode.required(),
  ref,
};

const insert = joi.object(body);

const update = joi.object(body);

module.exports = {
  insert,
  update,
};
