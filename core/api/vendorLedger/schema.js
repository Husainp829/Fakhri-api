const joi = require("joi");

const type = joi.string();
const vendorId = joi.string();
const paid = joi.number().allow(null, "");
const paidDate = joi.any().allow(null, "");
const mode = joi.string().allow(null, "");
const billDate = joi.any();
const billNo = joi.string();
const remarks = joi.string().allow(null, "");

const body = {
  vendorId: vendorId.required(),
  type: type.required(),
  paid,
  paidDate,
  mode,
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
