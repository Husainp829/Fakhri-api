const joi = require("joi");

const markaz = joi.string();
const HOFId = joi.number();
const HOFName = joi.string();
const HOFAddress = joi.string().allow(null, "");
const HOFPhone = joi.any();
const familyMembers = joi.any();
const takhmeenAmount = joi.number();
const zabihat = joi.number();
const iftaari = joi.number();
const chairs = joi.number();
const comments = joi.string().allow(null, "");
const details = joi.string().allow(null, "");
const mode = joi.string().allow(null, "");
const formNo = joi.string().allow(null, "");
const paidAmount = joi.number().allow(null, "");
const submitter = joi.string().allow(null, "");

const body = {
  markaz: markaz.required(),
  HOFId: HOFId.required(),
  HOFName: HOFName.required(),
  HOFAddress,
  HOFPhone: HOFPhone.required(),
  familyMembers,
  takhmeenAmount,
  zabihat,
  iftaari,
  chairs,
  comments,
  details,
  mode,
  formNo,
  paidAmount,
  submitter,
};

const updateBody = {
  markaz: markaz.required(),
  HOFId: HOFId.required(),
  HOFName: HOFName.required(),
  HOFAddress,
  HOFPhone: HOFPhone.required(),
  familyMembers,
  takhmeenAmount,
  zabihat,
  iftaari,
  chairs,
  comments,
  formNo,
};

const insert = joi.object(body);

const update = joi.object(updateBody);

module.exports = {
  insert,
  update,
};
