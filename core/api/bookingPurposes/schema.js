const joi = require("joi");

const id = joi.string();
const sarkariLagat = joi.number();

const body = {
  id,
  sarkariLagat,
};

const insert = joi.object(body);

const update = joi.object(body);

module.exports = {
  insert,
  update,
};
