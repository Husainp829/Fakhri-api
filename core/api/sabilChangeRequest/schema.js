const joi = require("joi");
const { SABIL_CHANGE_TYPES } = require("../../utils/enums");

const changeType = joi.string().valid(...Object.keys(SABIL_CHANGE_TYPES));
const sabilId = joi.string();
const transferTo = joi.string();
const toITS = joi.string();
const fromITS = joi.string();
const remarks = joi.string().allow(null, "");

const body = {
  changeType,
  sabilId,
  transferTo,
  toITS,
  fromITS,
  remarks,
};

const insert = joi.object(body);

module.exports = {
  insert,
};
