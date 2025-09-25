const joi = require("joi");

const organiser = joi.string();
const phone = joi.string();
const itsNo = joi.string();
const sadarat = joi.string();
const mohalla = joi.string();
const depositPaidAmount = joi.number();
const paidAmount = joi.number();
const extraExpenses = joi.number();
const writeOffAmount = joi.number();
const mode = joi.string();
const ref = joi.string();
const memberReference = joi.string();

const hallBookings = joi.array().items(
  joi.object({
    hallId: joi.string().uuid().required(),
    slot: joi.string().valid("morning", "afternoon", "evening").required(),
    date: joi.date().required(),
    thaals: joi.number().required(),
    withAC: joi.bool().required(),
    purpose: joi.string().required(),
  })
);

const comments = joi.string().allow("");

const actualThaals = joi
  .object()
  .pattern(
    joi.string().uuid(), // keys must be UUIDs
    joi.number().integer().min(0).required() // values are counts
  )
  .required();

const body = {
  organiser: organiser.required(),
  phone: phone.required(),
  itsNo: itsNo.required(),
  hallBookings: hallBookings.required(),
  sadarat,
  mohalla,
  depositPaidAmount,
  paidAmount,
  mode,
  ref,
  memberReference,
};

const closeBooking = joi.object({
  actualThaals: actualThaals.required(),
  comments,
  extraExpenses,
});

const insert = joi.object(body);

const update = joi.object({ ...body, writeOffAmount, extraExpenses });

module.exports = {
  insert,
  update,
  closeBooking,
};
