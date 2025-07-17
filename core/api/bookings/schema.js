const joi = require("joi");

const organiser = joi.string().required();
const purpose = joi.string().required();
const phone = joi.string().required();
const itsNo = joi.string().required();
const sadarat = joi.string();
const mohalla = joi.string();
const depositPaidAmount = joi.number();
const paidAmount = joi.number();
const writeOffAmount = joi.number();

const hallBookings = joi
  .array()
  .items(
    joi.object({
      hallId: joi.string().uuid().required(),
      slot: joi.string().valid("morning", "afternoon", "evening").required(),
      date: joi.date().required(),
      thaals: joi.number().required(),
    })
  )
  .required();

const body = {
  organiser,
  purpose,
  phone,
  itsNo,
  hallBookings,
  sadarat,
  mohalla,
  depositPaidAmount,
  paidAmount,
};

const insert = joi.object(body);

const update = joi.object({ ...body, writeOffAmount });

module.exports = {
  insert,
  update,
};
