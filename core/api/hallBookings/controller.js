const { Op } = require("sequelize");
const baseRepo = require("../base/repo");
const constants = require("../../const/constants");
const meta = require("./meta");

const ep = meta.ENDPOINT;
const include = [];

async function findAll(req, res) {
  const { query } = req;
  query.include = include;

  if (query.hallId && query.slot && query.date) {
    query.where = {
      [Op.and]: [
        { hallId: { [Op.eq]: `%${query.hallId}%` } },
        { slot: { [Op.eq]: `%${query.slot}%` } },
        { date: { [Op.eq]: `%${query.date}%` } },
      ],
    };
    delete query.hallId;
    delete query.hallId;
    delete query.hallId;
  }
  if (query.slot) {
    query.where = {
      ...query.where,
      slot: { [Op.eq]: query.slot },
    };
    delete query.slot;
  }
  if (query.namaazVenue) {
    query.where = {
      ...query.where,
      namaazVenue: { [Op.eq]: query.namaazVenue },
    };
    delete query.namaazVenue;
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
  const { body } = req;
  const { bookingId, hallId, date, slot } = body;

  try {
    if (!bookingId || !hallId || !date || !slot) {
      throw new Error("bookingId, hallId, date, and slot are required.");
    }

    const result = await baseRepo.insert(ep, {
      bookingId,
      hallId,
      date,
      slot,
    });

    sendResponse(res, result, constants.HTTP_STATUS_CODES.CREATED);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      sendError(
        res,
        { ...error, message: "This hall is already booked for the selected date and slot." },
        constants.HTTP_STATUS_CODES.ALREADY_EXISTS
      );
    } else {
      sendError(
        res,
        { message: error.message || "Internal server error" },
        constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}

async function update(req, res) {
  let code;
  const { body } = req;
  const { bookingId, hallId, date, slot } = body;

  try {
    const response = await baseRepo.update(ep, req.params.id, {
      bookingId,
      hallId,
      date,
      slot,
    });

    if (response && response.count > 0) {
      sendResponse(res, response, constants.HTTP_STATUS_CODES.CREATED);
    } else {
      code = constants.HTTP_STATUS_CODES.BAD_REQUEST;
      throwError("Record does not exist.", true);
    }
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      sendError(
        res,
        {
          ...err,
          message: "This hall is already booked for the selected date and slot.",
        },
        constants.HTTP_STATUS_CODES.ALREADY_EXISTS
      );
    } else {
      sendError(res, err, code || constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
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
