const Sequelize = require("sequelize");
const dayjs = require("dayjs");
const baseRepo = require("../base/repo");
const { SEQUENCE_NAMES, HTTP_STATUS_CODES } = require("../../const/constants");
const meta = require("./meta");
const { sequelize } = require("../../../models");
const models = require("../../../models");

const { Op } = Sequelize;
const ep = meta.ENDPOINT;
const fmbTakhmeen = "fmbTakhmeen";
const fmbTakhmeenCurrent = "fmbTakhmeenCurrent";

const includeParams = [
  {
    model: models.itsdata,
    as: "itsdata",
  },
  {
    model: models.fmbTakhmeen,
    as: fmbTakhmeenCurrent,
  },
];
async function findAll(req, res) {
  const { query } = req;
  query.include = includeParams;

  if (query.search) {
    query.where = {
      [Op.or]: [{ itsNo: { [Op.eq]: query.search } }, { fmbNo: { [Op.eq]: query.search } }],
    };
    delete query.search;
  }

  if (query.q) {
    query.where = {
      ...query.where,

      itsNo: { [Op.eq]: query.q },
    };
    delete query.q;
  }

  try {
    const results = await baseRepo.findAll(ep, query);
    sendResponse(res, results, HTTP_STATUS_CODES.OK);
  } catch (err) {
    sendError(res, err);
  }
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

  try {
    const {
      fmbNo,
      itsNo,
      name,
      address,
      mohallah,
      lastPaidDate,
      startDate,
      remarks,
      transferTo,
      takhmeenAmount,
      takhmeenYear,
    } = body;
    const { currentValue, prefix } = (await baseRepo.getCurrentSequence(SEQUENCE_NAMES.FMB)) || {};
    const result = await sequelize.transaction(async (t) => {
      // insert in fmbData
      const fmbN = fmbNo?.replace(/ +/g, "") || `${prefix}${currentValue + 1}`;
      const fmbData = await baseRepo.insert(
        ep,
        {
          itsNo,
          name,
          address,
          mohallah,
          lastPaidDate,
          fmbNo: fmbN,
          startDate,
          updatedBy: userId,
          remarks,
          transferTo,
        },
        t
      );
      // insert in fmbTakhmeen
      const fmbId = fmbData?.rows[0]?.id;
      const takhmeenRes = await baseRepo.insert(
        fmbTakhmeen,
        {
          fmbId,
          takhmeenAmount,
          pendingBalance: takhmeenAmount,
          paidBalance: 0,
          takhmeenYear,
          updatedBy: userId,
          startDate: startDate || dayjs().startOf("M"),
        },
        t
      );
      const takhmeenId = takhmeenRes?.rows[0]?.id;

      await baseRepo.update(ep, fmbId, { currentTakhmeenId: takhmeenId }, t);
      // update in sequence
      await baseRepo.updateSequence(SEQUENCE_NAMES.FMB, t);
      return fmbData;
    });
    sendResponse(res, result, HTTP_STATUS_CODES.CREATED);
  } catch (error) {
    sendError(res, error, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

  // return user;
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
  const { id } = req.params;
  try {
    const response = await baseRepo.update(ep, id, { closedAt: new Date() });
    if (response?.count > 0) {
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
