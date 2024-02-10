/* eslint-disable no-case-declarations */
const { sequelize } = require("../../../models");
const baseRepo = require("../base/repo");
const constants = require("../../const/constants");
const models = require("../../../models");
const meta = require("./meta");
const { SABIL_CHANGE_STATUS, SABIL_CHANGE_TYPES } = require("../../utils/enums");

const ep = meta.ENDPOINT;
const include = [];
const sabilData = "sabilData";
const itsData = "itsdata";
const includeParams = [
  {
    model: models.sabilData,
    as: sabilData,
    attributes: ["id", "sabilType", "sabilNo", "pendingBalance", "paidBalance"],
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
          "Jamaat"
        ],
      },
    ],
  },
];

async function findAll(req, res) {
  const { query } = req;
  query.include = include;
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
  const { changeType, sabilId, transferTo, toITS, fromITS, remarks } = body;

  try {
    const result = await sequelize.transaction(async (t) => {
      // insert in sabilData
      const changeRequest = await baseRepo.insert(
        ep,
        {
          changeType,
          sabilId,
          transferTo,
          toITS,
          fromITS,
          remarks,
          updatedBy: userId,
          status: SABIL_CHANGE_STATUS.PENDING,
        },
        t
      );
      return changeRequest;
    });
    sendResponse(res, result, constants.HTTP_STATUS_CODES.CREATED);
  } catch (error) {
    sendError(res, error, constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

async function approve(req, res) {
  let code;
  const { params, decoded } = req;
  const { userId } = decoded;
  const { id } = params;
  const data = await baseRepo.findById(ep, "id", id, includeParams);
  const { rows } = data;
  try {
    if (data.count > 0) {
      const { sabilId, changeType, remarks, toITS, transferTo } = rows[0] || {};
      const result = await sequelize.transaction(async (t) => {
        if (changeType === SABIL_CHANGE_TYPES.CLOSE) {
          await baseRepo.update(
            sabilData,
            sabilId,
            {
              closedAt: new Date(),
              updatedBy: userId,
              remarks,
            },
            t
          );
        }
        if (changeType === SABIL_CHANGE_TYPES.TRANSFER_OUT) {
          await baseRepo.update(
            sabilData,
            sabilId,
            {
              closedAt: new Date(),
              transferTo,
              updatedBy: userId,
              remarks,
            },
            t
          );
        }
        if (changeType === SABIL_CHANGE_TYPES.TRANSFER_WITHIN_JAMAAT) {
          const newItsData = await baseRepo.findById(itsData, "id", toITS, []);
          const row = newItsData?.rows?.[0] || {};
          // const
          await baseRepo.update(
            sabilData,
            sabilId,
            {
              name: row.Full_Name,
              itsNo: row.ITS_ID,
              address: row.Address,
              updatedBy: userId,
            },
            t
          );
        }
        const resp = await baseRepo.update(ep, id, { status: SABIL_CHANGE_STATUS.APPROVED }, t);
        return resp;
      });
      sendResponse(res, result, constants.HTTP_STATUS_CODES.CREATED);
    } else {
      code = constants.HTTP_STATUS_CODES.BAD_REQUEST;
      throwError("Does not exist", true);
    }
  } catch (err) {
    sendError(res, err, code);
  }
}
async function decline(req, res) {
  let code;
  const { params } = req;
  const { id } = params;
  const data = await baseRepo.findById(ep, "id", id, []);
  try {
    if (data.count > 0) {
      const result = await baseRepo.update(ep, id, { tatus: SABIL_CHANGE_STATUS.DECLINED });
      sendResponse(res, result, constants.HTTP_STATUS_CODES.CREATED);
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
  approve,
  decline,
};
