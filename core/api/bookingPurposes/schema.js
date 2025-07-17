const joi = require("joi");

const id = joi.string();

const body = {
  id,
};

const insert = joi.object(body);

const update = joi.object(body);

module.exports = {
  insert,
  update,
};
