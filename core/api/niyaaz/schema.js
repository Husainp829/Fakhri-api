const joi = require("joi");

const markaz = joi.string();
const namaazVenue = joi.string();
const HOFId = joi.number();
const HOFName = joi.string();
const HOFAddress = joi.string().allow(null, "");
const HOFPhone = joi.any();
const takhmeenAmount = joi.number().min(0);
const zabihat = joi.number().min(0);
const iftaari = joi.number().min(0);
const chairs = joi.number().min(0);
const comments = joi.string().allow(null, "");
const details = joi.string().allow(null, "");
const mode = joi.string().allow(null, "");
const formNo = joi.string().allow(null, "");
const paidAmount = joi.number().min(0);
const submitter = joi.string().allow(null, "");

const familyMembers = joi
  .array()
  .items({
    name: joi.string().required(),
    age: joi.string().required(),
    gender: joi.string().required(),
    its: joi.string().required(),
  })
  .min(1)
  .required();

const body = {
  markaz: markaz.required(),
  namaazVenue: namaazVenue.required(),
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
  namaazVenue: namaazVenue.required(),
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
