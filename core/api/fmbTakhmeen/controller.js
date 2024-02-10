const baseRepo = require("../base/repo");
const constants = require("../../const/constants");
const { sequelize } = require("../../../models");
const meta = require("./meta");

const ep = meta.ENDPOINT;
const fmbData = "fmbData";
const include = [];

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
    const data = await baseRepo.findById(ep, "sabilId", req.params.id, include);
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
    const { fmbId, startDate, takhmeenAmount, takhmeenYear } = body;
    const result = await sequelize.transaction(async (t) => {
      const takhmeen = await baseRepo.insert(
        ep,
        {
          fmbId,
          takhmeenAmount,
          takhmeenYear,
          pendingBalance: takhmeenAmount,
          paidBalance: 0,
          startDate,
          updatedBy: userId,
        },
        t
      );

      const takhmeenId = takhmeen?.rows[0]?.id;
      // update in sequence
      await baseRepo.update(fmbData, fmbId, { currentTakhmeenId: takhmeenId });
      return takhmeen;
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
