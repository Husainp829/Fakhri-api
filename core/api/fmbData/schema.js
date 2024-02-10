const joi = require("joi");

const itsNo = joi.number();
const name = joi.string().allow(null, "");
const remarks = joi.string().allow(null, "");
const transferTo = joi.string().allow(null, "");
const address = joi.string().allow(null, "");
const mohallah = joi.string().allow(null, "");
const lastPaidDate = joi.date().allow(null, "");
const pan = joi.string().allow(null, "");
const updatedBy = joi.string();
const closedAt = joi.date().allow(null, "");
const takhmeenAmount = joi.number();
const takhmeenYear = joi.number();

const insertBody = {
  itsNo,
  name,
  address,
  mohallah,
  lastPaidDate,
  pan,
  remarks,
  transferTo,
  takhmeenAmount,
  takhmeenYear,
};

const updateBody = {
  itsNo,
  name,
  address,
  mohallah,
  lastPaidDate,
  pan,
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
