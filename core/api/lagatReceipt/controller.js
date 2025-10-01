const { Op } = require("sequelize");
const { sequelize } = require("../../../models");
const baseRepo = require("../base/repo");
const constants = require("../../const/constants");
const meta = require("./meta");

const ep = meta.ENDPOINT;

const RECEIPT_LAGAT = "RECEIPT_LAGAT";

async function findAll(req, res) {
  const { query } = req;
  if (query.timePeriod) {
    const { from, to } = constants.TIME_PERIODS[query.timePeriod];
    query.where = {
      ...query.where,
      receiptDate: { [Op.between]: [from, to] },
    };
    delete query.timePeriod;
  }
  baseRepo
    .findAll(ep, query)
    .then((response) => {
      sendResponse(res, response, constants.HTTP_STATUS_CODES.OK);
    })
    .catch((err) => sendError(res, err));
}

async function findById(req, res) {
  let code;
  try {
    const data = await baseRepo.findById(ep, "id", req.params.id);
    if (data.count) {
      sendResponse(res, data, constants.HTTP_STATUS_CODES.OK);
    } else {
      code = constants.HTTP_STATUS_CODES.NOT_FOUND;
      throwError("Does not exist", true);
    }
  } catch (err) {
    sendError(res, err, code);
  }
}

async function insert(req, res) {
  const { body, decoded } = req;
  const { userId } = decoded;
  const { purpose, amount, remarks, paymentMode, paymentRef, itsNo, name } = body;
  const { currentValue, prefix } = (await baseRepo.getCurrentSequence(RECEIPT_LAGAT)) || {};
  try {
    const result = await sequelize.transaction(async (t) => {
      const receiptNo = `${prefix}${currentValue + 1}`;
      // insert in sabilData
      const receiptData = await baseRepo.insert(
        ep,
        {
          itsNo,
          name,
          purpose,
          receiptDate: new Date(),
          receiptType: "DEBIT",
          remarks,
          amount,
          paymentMode,
          paymentRef,
          receiptNo,
          updatedBy: userId,
        },
        t
      );
      // update in sequence
      await baseRepo.updateSequence(RECEIPT_LAGAT, t);
      return receiptData;
    });
    sendResponse(res, result, constants.HTTP_STATUS_CODES.CREATED);
  } catch (error) {
    sendError(res, error, constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

async function update(req, res) {
  let code;
  const { body, decoded } = req;
  const { userId } = decoded;
  try {
    const response = await baseRepo.update(ep, req.params.id, { ...body, updatedBy: userId });
    if (response && response.count > 0) {
      sendResponse(res, response, constants.HTTP_STATUS_CODES.CREATED);
    } else {
      code = constants.HTTP_STATUS_CODES.BAD_REQUEST;
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
      sendResponse(res, response, constants.HTTP_STATUS_CODES.OK);
    } else {
      code = constants.HTTP_STATUS_CODES.BAD_REQUEST;
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
