// const dayjs = require("dayjs");
const Sequelize = require("sequelize");
const dayjs = require("dayjs");
const baseRepo = require("../base/repo");
const constants = require("../../const/constants");
const meta = require("./meta");
const { sequelize } = require("../../../models");
const models = require("../../../models");
// const { formatDate } = require("../../utils/common");

const { Op } = Sequelize;
const ep = meta.ENDPOINT;
const sabilTakhmeen = "sabilTakhmeen";
const sabilTakhmeenCurrent = "sabilTakhmeenCurrent";
// const sabilReceipt = "sabilReceipt";
// const sabilAudit = "sabilAudit";

const includeParams = [
  {
    model: models.itsdata,
    as: "itsdata",
  },
  {
    model: models.sabilTakhmeen,
    as: sabilTakhmeenCurrent,
  },
];
async function findAll(req, res) {
  const { query } = req;
  query.include = includeParams;
  let countWhereQuery = {};

  if (query.search) {
    query.where = {
      [Op.or]: [{ itsNo: { [Op.eq]: query.search } }, { sabilNo: { [Op.eq]: query.search } }],
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
  if (query.status) {
    query.where = {
      ...query.where,
      closedAt: {
        [query.status === "ACTIVE" ? Op.is : Op.ne]: null,
      },
    };
    delete query.status;
  }

  countWhereQuery = { ...(query.where || {}) };
  if (query.sabilType) {
    query.where = {
      ...query.where,
      sabilType: { [Op.eq]: query.sabilType },
    };

    delete query.status;
  }

  try {
    const counts = await models[ep].findAll({
      where: countWhereQuery,
      attributes: ["sabilType", [sequelize.fn("COUNT", sequelize.col("sabilType")), "count"]],
      group: "sabilType",
    });

    const results = await baseRepo.findAll(ep, query);

    sendResponse(res, { ...results, counts }, constants.HTTP_STATUS_CODES.OK);
  } catch (err) {
    sendError(res, err);
  }
}

async function findById(req, res) {
  let code;

  try {
    const data = await baseRepo.findById(ep, "id", req.params.id, includeParams);
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

  try {
    const {
      sabilNo,
      sabilType,
      itsNo,
      takhmeen,
      name,
      firmName,
      address,
      mohallah,
      category,
      lastPaidDate,
      startDate,
      pendingBalance,
      paidBalance,
      remarks,
      transferTo,
      closedAt,
    } = body;
    const { currentValue, prefix } = (await baseRepo.getCurrentSequence(sabilType)) || {};
    const result = await sequelize.transaction(async (t) => {
      // insert in sabilData
      const sabilN = sabilNo?.replace(/ +/g, "") || `${prefix}${currentValue + 1}`;
      const sabilData = await baseRepo.insert(
        ep,
        {
          sabilType,
          itsNo,
          name,
          firmName,
          category,
          address,
          mohallah,
          lastPaidDate,
          sabilNo: sabilN,
          pendingBalance,
          paidBalance,
          startDate,
          updatedBy: userId,
          remarks,
          transferTo,
          closedAt,
        },
        t
      );
      // insert in sabilTakhmeen
      const sabilId = sabilData?.rows[0]?.id;
      const takhmeenRes = await baseRepo.insert(
        sabilTakhmeen,
        {
          sabilId,
          takhmeenAmount: takhmeen,
          startDate: startDate || dayjs().startOf("M"),
        },
        t
      );
      const takhmeenId = takhmeenRes?.rows[0]?.id;

      await baseRepo.update(ep, sabilId, { currentTakhmeenId: takhmeenId }, t);
      // update in sequence
      await baseRepo.updateSequence(sabilType, t);
      return sabilData;
    });
    sendResponse(res, result, constants.HTTP_STATUS_CODES.CREATED);
  } catch (error) {
    sendError(res, error, constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
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
  const { id } = req.params;
  try {
    const count = await baseRepo.remove(ep, id);
    if (count > 0) {
      sendResponse(res, { count, rows: [{ id }] }, constants.HTTP_STATUS_CODES.OK);
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
