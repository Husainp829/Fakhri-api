const moment = require("moment");
const baseRepo = require("../base/repo");
const constants = require("../../const/constants");
const meta = require("./meta");
const { sequelize } = require("../../../models");
const models = require("../../../models");
const { sendWhatsAppMessage } = require("../../service/whatsapp");

const ep = meta.ENDPOINT;
const include = [
  {
    model: models.hallBookings,
    as: "hallBookings",
    attributes: ["id", "hallId", "date", "slot", "thaals"],
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
  const { body, decoded } = req;
  const { userId } = decoded;

  const { organiser, purpose, phone, itsNo, hallBookings } = body;

  try {
    if (
      !hallBookings ||
      !Array.isArray(hallBookings) ||
      hallBookings.length === 0
    ) {
      throw new Error("hallBookings must be a non-empty array.");
    }

    const result = await sequelize.transaction(async (t) => {
      const { currentValue: bookingVal, prefix: bookingPrefix } =
        (await baseRepo.getCurrentSequence(
          constants.SEQUENCE_NAMES.HALL_BOOKING
        )) || {};
      const bookingN = `${bookingPrefix}-${bookingVal + 1}`;
      // Insert parent booking
      const bookingData = await baseRepo.insert(
        ep,
        {
          bookingNo: bookingN,
          organiser,
          purpose,
          phone,
          itsNo,
          submitter: userId,
        },
        t
      );

      const bookingId = bookingData?.rows?.[0]?.id;

      if (!bookingId) {
        throw new Error("Failed to create main booking.");
      }

      const hallBookingRows = hallBookings.map(
        ({ hallId, slot, date, thaals }) => ({
          bookingId,
          hallId,
          slot,
          date,
          thaals,
        })
      );

      await models.hallBookings.bulkCreate(hallBookingRows, { transaction: t });
      await baseRepo.updateSequence(constants.SEQUENCE_NAMES.HALL_BOOKING, t);

      return bookingId;
    });

    sendResponse(
      res,
      { count: 1, rows: [{ id: result }] },
      constants.HTTP_STATUS_CODES.CREATED
    );

    // Send WhatsApp notification on successful booking
    try {
      if (phone) {
        const message = `Salaam-e-Jameel,\n\n*${organiser}*, your booking for has been confirmed.\n\n${hallBookings
          .map((booking) => {
            const formattedDate = moment(booking.date, "YYYY-MM-DD").format(
              "D MMM YYYY"
            );
            return `${booking.hallId}: ${formattedDate} - ${booking.slot}`;
          })
          .join("\n")}\n\nShukran`;
        // Fire and forget, don't block response
        sendWhatsAppMessage({ phone, message }).catch((err) => {
          console.error("Failed to send WhatsApp notification:", err.message);
        });
      }
    } catch (err) {
      console.error("Error in WhatsApp notification logic:", err.message);
    }
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      sendError(
        res,
        {
          ...error,
          message:
            "One or more halls are already booked for the given slot and date.",
        },
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
      sendResponse(
        res,
        { count, rows: [{ id }] },
        constants.HTTP_STATUS_CODES.OK
      );
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
