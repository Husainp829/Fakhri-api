const joi = require("joi");

const type = joi.string();
const vendorId = joi.string();
const paid = joi.number();
const date = joi.any();
const mode = joi.string();
const remarks = joi.string().allow(null, "");

const body = {
  vendorId: vendorId.required(),
  type: type.required(),
  paid: paid.required(),
  mode: mode.required(),
  date: date.required(),
  remarks,
};

const insert = joi.object(body);

const update = joi.object(body);

module.exports = {
  insert,
  update,
};
