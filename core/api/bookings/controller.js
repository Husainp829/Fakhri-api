/* eslint-disable no-console */
const dayjs = require("dayjs");
const mustache = require("mustache");
const { keyBy } = require("lodash");
const baseRepo = require("../base/repo");
const constants = require("../../const/constants");
const meta = require("./meta");
const { sequelize } = require("../../../models");
const models = require("../../../models");
const { sendWhatsAppMessage } = require("../../service/whatsapp");
const { calcBookingTotals } = require("../../utils/helper");
const { bookingCreationTemplate } = require("../../utils/messageTemplates");

const ep = meta.ENDPOINT;
const include = [
  {
    model: models.hallBookings,
    as: "hallBookings",
    attributes: ["id", "hallId", "date", "slot", "thaals"],
    include: [
      {
        model: models.halls,
        as: "hall",
      },
    ],
  },
];

const includeAll = [
  ...include,
  {
    model: models.rentBookingReceipts,
    as: "rentBookingReceipts",
    attributes: ["id"],
  },
  {
    model: models.depositBookingReceipts,
    as: "depositBookingReceipts",
    attributes: ["id"],
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

async function sendCreateMessage(booking, halls) {
  const messageData = {
    organiser: booking.organiser,
    hallBookings: halls.map((b) => ({
      name: b.name,
      formattedDate: dayjs(b.date).format("D MMM YYYY"),
      slot: b.slot,
    })),
    rentReceipt: booking.rentBookingReceipts?.[0]
      ? { url: `${constants.UI_URL}/#/cont-rcpt/${booking.rentBookingReceipts[0].id}` }
      : undefined,
    depositReceipt: booking.depositBookingReceipts?.[0]
      ? { url: `${constants.UI_URL}/#/dep-rcpt/${booking.depositBookingReceipts[0].id}` }
      : undefined,
  };

  const message = mustache.render(bookingCreationTemplate, messageData);
  sendWhatsAppMessage({ phone: booking.phone, message }).catch((err) => {
    console.error("Failed to send WhatsApp notification:", err.message);
  });
}

async function insert(req, res) {
  const { body, decoded } = req;
  const { userId } = decoded;

  const {
    organiser,
    purpose,
    phone,
    itsNo,
    hallBookings,
    sadarat,
    mohalla,
    depositPaidAmount,
    paidAmount,
  } = body;

  try {
    if (!hallBookings?.length) {
      throw new Error("hallBookings must be a non-empty array.");
    }

    const hallIds = hallBookings.map((h) => h.hallId);
    const hallsArr = await baseRepo.findAll("halls", {
      filter: JSON.stringify({ id: hallIds }),
    });
    const halls = keyBy(hallsArr.rows, "id");

    const enrichedBookings = hallBookings.map((h) => ({ ...h, ...halls[h.hallId] }));
    const { rent: rentAmount, deposit: depositAmount, thaals: thaalCount } = calcBookingTotals(
      enrichedBookings
    );

    const result = await sequelize.transaction(async (t) => {
      const [hallSeq, rentReceiptSeq, depositReceiptSeq] = await Promise.all([
        baseRepo.getCurrentSequence(constants.SEQUENCE_NAMES.HALL_BOOKING),
        paidAmount > 0
          ? baseRepo.getCurrentSequence(constants.SEQUENCE_NAMES.RENT_BOOKING_RECEIPT)
          : Promise.resolve(null),
        depositPaidAmount > 0
          ? baseRepo.getCurrentSequence(constants.SEQUENCE_NAMES.DEPOSIT_BOOKING_RECEIPT)
          : Promise.resolve(null),
      ]);

      const bookingNo = `${hallSeq.prefix}-${hallSeq.currentValue + 1}`;

      // Insert parent booking
      const bookingData = await baseRepo.insert(
        ep,
        {
          bookingNo,
          organiser,
          purpose,
          phone,
          itsNo,
          submitter: userId,
          sadarat,
          mohalla,
          rentAmount,
          depositAmount,
          thaalAmount: thaalCount * constants.PER_THAAL_COST,
          depositPaidAmount,
          paidAmount,
        },
        t
      );

      const bookingId = bookingData?.rows?.[0]?.id;
      if (!bookingId) throw new Error("Failed to create main booking.");

      // Prepare inserts
      const promises = [];

      // Hall booking sequence update
      promises.push(baseRepo.updateSequence(constants.SEQUENCE_NAMES.HALL_BOOKING, t));

      // Hall bookings
      const hallBookingRows = hallBookings.map(({ hallId, slot, date, thaals }) => ({
        bookingId,
        hallId,
        slot,
        date,
        thaals,
      }));
      promises.push(models.hallBookings.bulkCreate(hallBookingRows, { transaction: t }));

      const receiptBase = {
        bookingId,
        organiser,
        organiserIts: itsNo,
        date: new Date(),
        amount: paidAmount,
        mode: "CASH",
        total: paidAmount,
        createdBy: userId,
      };

      // Rent receipt
      if (paidAmount > 0 && rentReceiptSeq) {
        const receiptNo = `${rentReceiptSeq.prefix}-${rentReceiptSeq.currentValue + 1}`;
        promises.push(
          baseRepo.insert("rentBookingReceipts", { ...receiptBase, receiptNo }, t),
          baseRepo.updateSequence(constants.SEQUENCE_NAMES.RENT_BOOKING_RECEIPT, t)
        );
      }

      // Deposit receipt
      if (depositPaidAmount > 0 && depositReceiptSeq) {
        const depositNo = `${depositReceiptSeq.prefix}-${depositReceiptSeq.currentValue + 1}`;
        promises.push(
          baseRepo.insert("depositBookingReceipts", { ...receiptBase, depositNo, mode: "CASH" }, t),
          baseRepo.updateSequence(constants.SEQUENCE_NAMES.DEPOSIT_BOOKING_RECEIPT, t)
        );
      }

      // Execute all inserts/updates in parallel
      await Promise.all(promises);

      return bookingId;
    });

    const bookings = await baseRepo.findById(ep, "id", result, includeAll);
    const booking = bookings.rows?.[0] || {};

    sendResponse(res, { count: 1, rows: [{ id: result }] }, constants.HTTP_STATUS_CODES.CREATED);
    // Async WhatsApp notification (non-blocking)
    if (phone) {
      await sendCreateMessage(booking, enrichedBookings);
    }
  } catch (error) {
    const status =
      error.name === "SequelizeUniqueConstraintError"
        ? constants.HTTP_STATUS_CODES.ALREADY_EXISTS
        : constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

    sendError(
      res,
      {
        ...error,
        message:
          error.name === "SequelizeUniqueConstraintError"
            ? "One or more halls are already booked for the given slot and date."
            : error.message || "Internal server error",
      },
      status
    );
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
