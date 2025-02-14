const { Op } = require("sequelize");
const baseRepo = require("../base/repo");
const constants = require("../../const/constants");
const meta = require("./meta");
const models = require("../../../models");

const ep = meta.ENDPOINT;
const include = [
  {
    model: models.admins,
    as: "admin",
  },
  {
    model: models.vendors,
    as: "vendor",
  },
];

async function findAll(req, res) {
  const { query, decoded } = req;
  query.include = include;
  if (query.vendorId) {
    query.where = {
      ...query.where,
      vendorId: { [Op.eq]: query.vendorId },
    };
    delete query.vendorId;
  }
  if (decoded.eventId) {
    query.where = {
      ...query.where,
      eventId: { [Op.eq]: decoded.eventId },
    };
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
    const data = await baseRepo.findById(ep, "id", req.params.id, include);
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
  const { userId, eventId } = decoded;

  try {
    const { vendorId, type, paid, mode, date, remarks } = body;

    const result = await baseRepo.insert(ep, {
      vendorId,
      eventId,
      type,
      paid,
      mode,
      date,
      remarks,
      updatedBy: userId,
    });

    sendResponse(res, result, constants.HTTP_STATUS_CODES.CREATED);
  } catch (error) {
    sendError(res, error, constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

  // return user;
}

async function update(req, res) {
  let code;
  const { body } = req;
  try {
    const response = await baseRepo.update(ep, req.params.id, body);
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
