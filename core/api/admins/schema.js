const joi = require("joi");

const id = joi.string();

const name = joi.string();
const email = joi.string().email({ tlds: { allow: false } });
const password = joi.string();
const permissions = joi.any();

const body = joi.object({
  name: name.required(),
  email: email.required(),
  password: password.required(),
  permissions: permissions.required(),
});

const params = joi.object({
  id: id.required(),
});

const update = joi.object({
  name: name.required(),
  email: email.required(),
  permissions: permissions.required(),
});

module.exports = {
  body,
  params,
  update,
};
