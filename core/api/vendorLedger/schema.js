const joi = require("joi");

const type = joi.string();
const vendorId = joi.string();
const paid = joi.number().allow(null, "");
const paidDate = joi.any().allow(null, "");
const billDate = joi.any().allow(null, "");
const billNo = joi.string();
const mode = joi.string();
const remarks = joi.string().allow(null, "");

const body = {
  vendorId: vendorId.required(),
  type: type.required(),
  paid,
  mode: mode.required(),
  paidDate,
  billDate,
  billNo: billNo.required(),
  remarks,
};

const insert = joi.object(body);

const update = joi.object(body);

module.exports = {
  insert,
  update,
};
