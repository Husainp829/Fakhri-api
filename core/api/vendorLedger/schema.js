const joi = require("joi");

const type = joi.string();
const vendorId = joi.string();
const paid = joi.number();
const paidDate = joi.any();
const billDate = joi.any();
const billNo = joi.string();
const mode = joi.string();
const remarks = joi.string().allow(null, "");

const body = {
  vendorId: vendorId.required(),
  type: type.required(),
  paid: paid.required(),
  mode: mode.required(),
  paidDate: paidDate.required(),
  billDate: billDate.required(),
  billNo: billNo.required(),
  remarks,
};

const insert = joi.object(body);

const update = joi.object(body);

module.exports = {
  insert,
  update,
};
