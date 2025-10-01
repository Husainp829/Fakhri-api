const { Op } = require("sequelize");
const baseRepo = require("../base/repo");
const constants = require("../../const/constants");
const { sequelize } = require("../../../models");
const meta = require("./meta");
const models = require("../../../models");

const ep = meta.ENDPOINT;
const bookings = "bookings";
const include = [
  {
    model: models.admins,
    as: "admin",
  },
  {
    model: models.bookings,
    as: "booking",
  },
];

async function findAll(req, res) {
  const { query } = req;
  query.include = include;
  if (query.timePeriod) {
    const { from, to } = constants.TIME_PERIODS[query.timePeriod];
    query.where = {
      ...query.where,
      date: { [Op.between]: [from, to] },
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
  const { userId } = decoded;

  try {
    const { bookingId, organiser, organiserIts, amount, mode, ref, type } = body;
    const { currentValue, prefix } =
      (await baseRepo.getCurrentSequence(
        type === "RENT"
          ? constants.SEQUENCE_NAMES.RENT_BOOKING_RECEIPT
          : constants.SEQUENCE_NAMES.DEPOSIT_BOOKING_RECEIPT
      )) || {};
    const result = await sequelize.transaction(async (t) => {
      const receiptN = `${prefix}-${currentValue + 1}`;
      const receiptData = await baseRepo.insert(
        ep,
        {
          receiptNo: receiptN,
          bookingId,
          organiser,
          organiserIts,
          date: new Date(),
          amount,
          mode,
          createdBy: userId,
          ref,
          type,
        },
        t
      );
      await baseRepo.appendAmount(
        bookings,
        bookingId,
        type === "RENT"
          ? { paidAmount: parseInt(amount, 10) }
          : { depositPaidAmount: parseInt(amount, 10) },
        t
      );
      await baseRepo.updateSequence(
        type === "RENT"
          ? constants.SEQUENCE_NAMES.RENT_BOOKING_RECEIPT
          : constants.SEQUENCE_NAMES.DEPOSIT_BOOKING_RECEIPT,
        t
      );
      // update in sequence
      return receiptData;
    });
    sendResponse(res, result, constants.HTTP_STATUS_CODES.CREATED);
  } catch (error) {
    sendError(res, error, constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
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
