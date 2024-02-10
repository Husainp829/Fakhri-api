const joi = require("joi");

const fmbId = joi.string().required();
const fmbTakhmeenId = joi.string().required();
const amount = joi.number().required();
const receiptDate = joi.date();
const paymentMode = joi.string();
const remarks = joi.string().allow(null, "");
const updatedBy = joi.string();
const deletedOn = joi.date().allow(null, "");

const body = {
  fmbId,
  fmbTakhmeenId,
  amount,
  receiptDate,
  paymentMode,
  remarks,
  deletedOn,
  updatedBy,
};

const insert = joi.object(body);

const update = joi.object(body);

module.exports = {
  insert,
  update,
};
