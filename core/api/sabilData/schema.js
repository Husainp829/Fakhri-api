const joi = require("joi");

const sabilNo = joi.string();
const prevSabilNo = joi.string().allow(null, "");
const sabilType = joi.string();
const itsNo = joi.number();
const name = joi.string().allow(null, "");
const firmName = joi.string().allow(null, "");
const firmAddress = joi.string().allow(null, "");
const remarks = joi.string().allow(null, "");
const transferTo = joi.string().allow(null, "");
const address = joi.string().allow(null, "");
const mohallah = joi.string().allow(null, "");
const category = joi.string().allow(null, "");
const lastPaidDate = joi.date().allow(null, "");
const pan = joi.string().allow(null, "");
const pendingBalance = joi.number();
const paidBalance = joi.number();
const takhmeen = joi.number();
const updatedBy = joi.string();
const closedAt = joi.date().allow(null, "");

const insertBody = {
  sabilNo,
  prevSabilNo,
  sabilType,
  itsNo,
  name,
  firmName,
  firmAddress,
  address,
  mohallah,
  category,
  lastPaidDate,
  pan,
  pendingBalance,
  paidBalance,
  takhmeen,
  remarks,
  transferTo,
  closedAt,
};

const updateBody = {
  sabilNo,
  prevSabilNo,
  sabilType,
  itsNo,
  name,
  firmName,
  firmAddress,
  address,
  mohallah,
  category,
  lastPaidDate,
  pan,
  pendingBalance,
  paidBalance,
  remarks,
  transferTo,
  updatedBy,
  closedAt,
};

const insert = joi.object(insertBody);

const update = joi.object(updateBody);

module.exports = {
  insert,
  update,
};
