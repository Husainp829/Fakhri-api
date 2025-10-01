const joi = require("joi");

const itsNo = joi.string();
const name = joi.string();
const purpose = joi.string();
const amount = joi.number();
const paymentMode = joi.string();
const paymentRef = joi.string();
const remarks = joi.string().allow(null, "");

const body = {
  itsNo: itsNo.required(),
  name: name.required(),
  purpose: purpose.required(),
  amount: amount.required(),
  paymentMode: paymentMode.required(),
  paymentRef,
  remarks,
};

const insert = joi.object(body);

const update = joi.object(body);

module.exports = {
  insert,
  update,
};
