const { Op } = require("sequelize");
const { sequelize } = require("../../../models");
const baseRepo = require("../base/repo");
const { SEQUENCE_NAMES, HTTP_STATUS_CODES } = require("../../const/constants");
const models = require("../../../models");
const meta = require("./meta");

const ep = meta.ENDPOINT;
const include = [];
const fmbData = "fmbData";
const includeParams = [
  {
    model: models.fmbData,
    as: fmbData,
    attributes: ["id", "fmbNo"],
    include: [
      {
        model: models.itsdata,
        as: "itsdata",
        attributes: [
          "id",
          "ITS_ID",
          "Full_Name_Arabic",
          "Full_Name",
          "Address",
          "City",
          "State",
          "Pincode",
        ],
      },
    ],
  },
];
const fmbTakhmeen = "fmbTakhmeen";

async function findAll(req, res) {
  const { query } = req;
  query.include = include;
  if (query.fmbId) {
    query.where = {
      ...query.where,
      fmbId: { [Op.eq]: query.fmbId },
    };
    delete query.fmbId;
  }
  baseRepo
    .findAll(ep, query)
    .then((response) => {
      sendResponse(res, response, HTTP_STATUS_CODES.OK);
    })
    .catch((err) => sendError(res, err));
}

async function findById(req, res) {
  let code;
  try {
    const data = await baseRepo.findById(ep, "id", req.params.id, includeParams);
    if (data.count) {
      sendResponse(res, data, HTTP_STATUS_CODES.OK);
    } else {
      code = HTTP_STATUS_CODES.NOT_FOUND;
      throwError("Does not exist", true);
    }
  } catch (err) {
    sendError(res, err, code);
  }
}

async function insert(req, res) {
  const { body, decoded } = req;
  const { userId } = decoded;
  const { fmbId, fmbTakhmeenId, receiptDate, amount, remarks, paymentMode } = body;
  const { currentValue, prefix } =
    (await baseRepo.getCurrentSequence(SEQUENCE_NAMES.RECEIPT_FMB)) || {};
  try {
    const result = await sequelize.transaction(async (t) => {
      const receiptNo = `${prefix}${currentValue + 1}`;
      // insert in sabilData
      const receiptData = await baseRepo.insert(
        ep,
        {
          fmbId,
          fmbTakhmeenId,
          receiptDate,
          receiptType: "DEBIT",
          remarks,
          amount,
          paymentMode,
          receiptNo,
          updatedBy: userId,
        },
        t
      );
      // update in sequence
      await baseRepo.appendAmount(fmbTakhmeen, fmbTakhmeenId, { paidBalance: amount }, t);
      await baseRepo.updateSequence(SEQUENCE_NAMES.RECEIPT_FMB, t);
      return receiptData;
    });
    sendResponse(res, result, HTTP_STATUS_CODES.CREATED);
  } catch (error) {
    sendError(res, error, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

async function update(req, res) {
  let code;
  const { body, decoded } = req;
  const { userId } = decoded;
  try {
    const response = await baseRepo.update(ep, req.params.id, { ...body, updatedBy: userId });
    if (response && response.count > 0) {
      sendResponse(res, response, HTTP_STATUS_CODES.CREATED);
    } else {
      code = HTTP_STATUS_CODES.BAD_REQUEST;
      throwError("Does not exist", true);
    }
  } catch (err) {
    sendError(res, err, code);
  }
}

async function remove(req, res) {
  let code;
  try {
    const response = await baseRepo.update(ep, req.params.id, {
      closedOn: new Date(),
    });
    if (response && response.count > 0) {
      sendResponse(res, response, HTTP_STATUS_CODES.OK);
    } else {
      code = HTTP_STATUS_CODES.BAD_REQUEST;
      throwError("Does not exist", true);
    }
  } catch (err) {
    sendError(res, err, code);
  }
}

module.exports = {
  findAll,
  findById,
  insert,
  update,
  remove,
};
