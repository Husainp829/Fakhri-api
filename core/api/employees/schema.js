const joi = require("joi");

const id = joi.string();

const name = joi.string();
const phone = joi.string();
const type = joi.string();

const body = joi.object({
  name: name.required(),
  phone: phone.required(),
  type: type.required(),
});

const params = joi.object({
  id: id.required(),
});

const update = joi.object({
  name: name.required(),
  phone: phone.required(),
  type: type.required(),
});

module.exports = {
  body,
  params,
  update,
};
