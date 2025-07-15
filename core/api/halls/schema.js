const joi = require("joi");

const name = joi.string();
const shortCode = joi.string();
const thaalCapacity = joi.number();
const rent = joi.number();
const deposit = joi.number();

const body = {
  name,
  shortCode,
  thaalCapacity,
  rent,
  deposit,
};

const insert = joi.object(body);

const update = joi.object(body);

module.exports = {
  insert,
  update,
};
