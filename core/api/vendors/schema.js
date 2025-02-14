const joi = require("joi");

const name = joi.string();
const mobile = joi.any();

const body = {
  name: name.required(),
  mobile: mobile.required(),
};

const insert = joi.object(body);

const update = joi.object(body);

module.exports = {
  insert,
  update,
};
