const { Op } = require("sequelize");
const baseRepo = require("../base/repo");
const constants = require("../../const/constants");
const meta = require("./meta");
const models = require("../../../models");
const { calculateThaalAmount } = require("../../utils/bookingCalculations");

const ep = meta.ENDPOINT;
const include = [
  {
    model: models.bookings,
    as: "booking",
    attributes: ["bookingNo", "purpose", "mohalla", "organiser", "itsNo", "sadarat", "phone"],
    required: true,
  },
  {
    model: models.halls,
    as: "hall",
    attributes: ["name"],
    required: true,
  },
];

async function findAll(req, res) {
  const { query } = req;
  query.include = include;
  query.where = {};
  if (query.hallId && query.slot && query.date) {
    query.where = {
      hallId: query.hallId,
      slot: query.slot,
      date: query.date,
    };
    delete query.hallId;
    delete query.slot;
    delete query.date;
  }

  if (query.start && query.end) {
    query.where.date = {
      [Op.between]: [query.start, query.end],
    };
    delete query.start;
    delete query.end;
  }

  if (query.bookingId) {
    query.where.bookingId = query.bookingId;
    delete query.bookingId;
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
  const { bookingId, hallId, date, slot, thaals, withAC } = body;

  try {
    if (!bookingId || !hallId || !date || !slot) {
      throw new Error("bookingId, hallId, date, and slot are required.");
    }

    const [bookings, hallsArr] = await Promise.all([
      baseRepo.findById("bookings", "id", bookingId, {
        model: models.bookingPurpose,
        as: "bookingPurpose",
        required: true,
      }),
      baseRepo.findById("halls", "id", hallId, null),
    ]);

    const hall = hallsArr.rows?.[0] || {};
    const booking = bookings.rows?.[0] || {};
    const { bookingPurpose } = booking;

    const result = await baseRepo.insert(ep, {
      bookingId,
      hallId,
      date,
      slot,
      withAC,
      thaals,
      thaalAmount: calculateThaalAmount(thaals, bookingPurpose?.perThaal),
      rent: hall.rent || 0,
      deposit: hall.deposit || 0,
      acCharges: hall.acCharges || 0,
      kitchenCleaning: hall.kitchenCleaning || 0,
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
  const { bookingId, hallId, date, slot, thaals, withAC } = body;

  try {
    const response = await baseRepo.update(ep, req.params.id, {
      bookingId,
      hallId,
      date,
      slot,
      thaals,
      withAC,
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
    const count = await baseRepo.remove(ep, id, true);
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
