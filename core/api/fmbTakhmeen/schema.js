const joi = require("joi");

const fmbId = joi.string();
const takhmeenAmount = joi.number();
const takhmeenYear = joi.number();
const startDate = joi.date();
const updatedBy = joi.string();

const body = {
  fmbId,
  takhmeenAmount,
  takhmeenYear,
  startDate,
  updatedBy,
};

const insert = joi.object(body);

const update = joi.object(body);

module.exports = {
  insert,
  update,
};
