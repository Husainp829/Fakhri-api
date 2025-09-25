const baseRepo = require("../base/repo");
const constants = require("../../const/constants");
const meta = require("./meta");
const models = require("../../../models");

const ep = meta.ENDPOINT;
const include = [
  {
    model: models.purposeHallCharges,
    as: "hallCharges",
    attributes: [
      "hallId",
      "rent",
      "deposit",
      "acCharges",
      "kitchenCleaning",
      "includeThaalCharges",
    ],
    required: true,
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
  const { body } = req;
  const { id } = body;

  try {
    const purpose = await baseRepo.insert(ep, {
      id,
    });
    sendResponse(res, purpose, constants.HTTP_STATUS_CODES.CREATED);
  } catch (error) {
    sendError(res, error, constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

async function update(req, res) {
  let code;
  const { body } = req;
  try {
    const response = await baseRepo.update(ep, req.params.id, { id: body.id });
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
