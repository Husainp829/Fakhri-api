const joi = require("joi");

const name = joi.string();

const fromDate = joi.string();
const toDate = joi.string();

const insert = joi.object({
  name: name.required(),
  fromDate: fromDate.required(),
  toDate: toDate.required(),
});

const update = joi.object({});

module.exports = {
  insert,
  update,
};
