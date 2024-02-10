const joi = require("joi");

const refId = joi.string();
const actionType = joi.string();
const remarks = joi.string();
const createdBy = joi.string();

const body = {
  refId,
  actionType,
  remarks,
  createdBy,
};

const insert = joi.object(body);

const update = joi.object(body);

module.exports = {
  insert,
  update,
};
