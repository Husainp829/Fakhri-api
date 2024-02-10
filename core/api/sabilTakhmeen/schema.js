const joi = require("joi");

const sabilId = joi.string();
const takhmeenAmount = joi.number();
const startDate = joi.date();
const updatedBy = joi.string();

const body = {
  sabilId,
  takhmeenAmount,
  startDate,
  updatedBy,
};

const insert = joi.object(body);

const update = joi.object(body);

module.exports = {
  insert,
  update,
};
