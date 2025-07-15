const joi = require("joi");

const organiser = joi.string();
const purpose = joi.string();
const phone = joi.string();
const itsNo = joi.string();
const hallBookings = joi.array().items(
  joi.object({
    hallId: joi.string().uuid().required(),
    slot: joi.string().valid("morning", "afternoon", "evening").required(),
    date: joi.date().required(),
    thaals: joi.number().required(),
  })
);

const body = {
  organiser,
  purpose,
  phone,
  itsNo,
  hallBookings,
};

const insert = joi.object(body);

const update = joi.object(body);

module.exports = {
  insert,
  update,
};
