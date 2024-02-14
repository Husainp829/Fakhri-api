const joi = require("joi");

const formNo = joi.string();
const HOFId = joi.string().allow(null, "");
const HOFName = joi.string().allow(null, "");
const amount = joi.number();
const mode = joi.string().allow(null, "");
const details = joi.string().allow(null, "");
const markaz = joi.string().allow(null, "");

const niyaazId = joi.string();

const body = {
  niyaazId,
  formNo,
  HOFId,
  HOFName,
  amount,
  mode,
  details,
  markaz,
};

const insert = joi.object(body);

const update = joi.object(body);

module.exports = {
  insert,
  update,
};
