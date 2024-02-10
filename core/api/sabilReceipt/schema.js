const joi = require("joi");

const sabilId = joi.string();
const amount = joi.number();
const receiptDate = joi.date();
const paymentMode = joi.string();
const remarks = joi.string().allow(null, "");
const updatedBy = joi.string();
const deletedOn = joi.date().allow(null, "");

const body = {
  sabilId,
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
