const baseRepo = require("../base/repo");
const constants = require("../../const/constants");
const meta = require("./meta");

const ep = meta.ENDPOINT;

async function findAll(req, res) {
  const { query } = req;

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
      const { rows } = data;

      const response = {
        count: data.count,
        rows,
      };
      sendResponse(res, response, constants.HTTP_STATUS_CODES.OK);
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
  try {
    const params = {
      name: body.name,
      phone: body.phone,
      type: body.type,
    };
    const employee = await baseRepo.insert(ep, params);

    sendResponse(res, employee, constants.HTTP_STATUS_CODES.CREATED);
  } catch (err) {
    sendError(res, err, constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

async function update(req, res) {
  let code;

  try {
    const { body } = req;

    const data = await baseRepo.findById(ep, "id", req.params.id);
    const { ...other } = body;
    if (data.count) {
      const response = await baseRepo.update(ep, req.params.id, other);
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
    const data = await baseRepo.findById(ep, "id", req.params.id);
    if (data.count) {
      baseRepo.remove(ep, id);
      sendResponse(res, data, constants.HTTP_STATUS_CODES.OK);
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
