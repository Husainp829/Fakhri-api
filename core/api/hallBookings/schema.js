const joi = require("joi");

const bookingId = joi.string().uuid().required();
const hallId = joi.string().uuid().required();
const slot = joi.string().valid("morning", "afternoon", "evening").required();
const date = joi.date().required();
const thaals = joi.number().required();
const withAC = joi.bool().required();

const body = {
  bookingId,
  hallId,
  slot,
  date,
  thaals,
  withAC,
};

const insert = joi.object(body);

const update = joi.object(body);

module.exports = {
  insert,
  update,
};
