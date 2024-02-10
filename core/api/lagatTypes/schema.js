const joi = require("joi");

const name = joi.string();
const amount = joi.number();
const description = joi.string();

const body = {
  name,
  amount,
  description,
};

const insert = joi.object(body);

const update = joi.object(body);

module.exports = {
  insert,
  update,
};
