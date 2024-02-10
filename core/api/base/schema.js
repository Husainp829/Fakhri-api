const joi = require("joi");

const permissions = joi.any();
const userId = joi.string().allow(null, "");
const uid = joi.string().allow(null, "");
const eventId = joi.string().allow(null, "");

const decoded = joi.object({
  permissions,
  uid,
  userId,
  eventId,
});

module.exports = {
  decoded,
};
