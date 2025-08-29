const joi = require("joi");

const type = joi.string();
const month = joi.string();

const params = joi.object({
  type: type.required(),
  month: month.required(),
});

module.exports = {
  params,
};
