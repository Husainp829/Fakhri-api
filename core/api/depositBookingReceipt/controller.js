const baseRepo = require("../base/repo");
const constants = require("../../const/constants");
const { sequelize } = require("../../../models");
const meta = require("./meta");
const models = require("../../../models");

const ep = meta.ENDPOINT;
const niyaaz = "niyaaz";
const include = [
  {
    model: models.admins,
    as: "admin",
  },
];

const includeBooking = [
  {
    model: models.bookings,
    as: "booking",
    attributes: ["bookingNo", "purpose", "mohalla"],
  },
];

async function findAll(req, res) {
  const { query, decoded } = req;
  query.include = include;
  query.eventId = decoded.eventId;
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
    const data = await baseRepo.findById(ep, "id", req.params.id, includeBooking);
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
    const { niyaazId, formNo, HOFId, HOFName, amount, mode, details, markaz, namaazVenue } = body;
    const { currentValue, prefix } =
      (await baseRepo.getCurrentSequence(constants.SEQUENCE_NAMES.RECEIPT_NIYAAZ)) || {};
    const result = await sequelize.transaction(async (t) => {
      const receiptN = `${prefix}-${currentValue + 1}`;
      const receiptData = await baseRepo.insert(
        ep,
        {
          receiptNo: receiptN,
          eventId,
          formNo,
          niyaazId,
          markaz,
          namaazVenue,
          HOFId,
          HOFName,
          date: new Date(),
          amount,
          mode,
          total: amount,
          createdBy: userId,
          details,
        },
        t
      );
      await baseRepo.appendAmount(niyaaz, niyaazId, { paidAmount: parseInt(amount, 10) }, t);
      await baseRepo.updateSequence(constants.SEQUENCE_NAMES.RECEIPT_NIYAAZ, t);
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
