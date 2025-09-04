/* eslint-disable no-console */
const dayjs = require("dayjs");
const mustache = require("mustache");
const { keyBy } = require("lodash");
const { Op } = require("sequelize");
const baseRepo = require("../base/repo");
const constants = require("../../const/constants");
const meta = require("./meta");
const { sequelize } = require("../../../models");
const models = require("../../../models");
const {
  calculateThaalAmount,
  calcBookingTotals,
} = require("../../utils/bookingCalculations");
const { bookingCreationTemplate } = require("../../utils/messageTemplates");
const { sendWhatsAppMessage } = require("../../service/whatsapp-meta");

const ep = meta.ENDPOINT;
const include = [
  {
    model: models.hallBookings,
    as: "hallBookings",
    attributes: { exclude: ["deletedAt"] },
    include: [
      {
        model: models.halls,
        as: "hall",
        attributes: ["name", "includeThaalCharges"],
      },
      {
        model: models.bookingPurpose,
        as: "bookingPurpose",
        attributes: ["perThaal", "jamaatLagat"],
      },
    ],
  },
  {
    model: models.admins,
    as: "admin",
  },
];

const includeAll = [
  ...include,
  {
    model: models.rentBookingReceipts,
    as: "rentBookingReceipts",
    attributes: ["id"],
  },
];

async function findAll(req, res) {
  const { query } = req;

  if (query.search) {
    query.where = {
      [Op.or]: [
        { itsNo: { [Op.eq]: query.search } },
        { bookingNo: { [Op.eq]: query.search } },
        { organiser: { [Op.like]: `%${query.search}%` } },
      ],
    };
    delete query.search;
  }
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
      ? {
          url: `${constants.UI_URL}/#/cont-rcpt/${booking.rentBookingReceipts[0].id}`,
        }
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
    phone,
    itsNo,
    hallBookings,
    sadarat,
    mohalla,
    depositPaidAmount,
    paidAmount,
    mode,
    ref,
  } = body;

  try {
    if (!hallBookings?.length) {
      throw new Error("hallBookings must be a non-empty array.");
    }

    const hallIds = hallBookings.map((h) => h.hallId);
    const purposeIds = hallBookings.map((h) => h.purpose);
    const [hallsArr, bookingPurposeData] = await Promise.all([
      baseRepo.findAll("halls", {
        filter: JSON.stringify({ id: hallIds }),
      }),
      baseRepo.findAll("bookingPurpose", {
        filter: JSON.stringify({ id: purposeIds }),
      }),
    ]);

    const halls = keyBy(hallsArr.rows, "id");
    const purposes = keyBy(bookingPurposeData.rows, "id");

    const enrichedBookings = hallBookings.map((h) => ({
      ...h,
      ...halls[h.hallId],
      perThaal: purposes[h.purpose].perThaal || 0,
      jamaatLagat: purposes[h.purpose].jamaatLagat || 0,
    }));

    const { jamaatLagat } = calcBookingTotals({
      halls: enrichedBookings,
      depositPaidAmount,
      paidAmount,
      mohalla,
    });

    const result = await sequelize.transaction(async (t) => {
      const [hallSeq, rentReceiptSeq, depositReceiptSeq] = await Promise.all([
        baseRepo.getCurrentSequence(constants.SEQUENCE_NAMES.HALL_BOOKING),
        paidAmount > 0
          ? baseRepo.getCurrentSequence(
              constants.SEQUENCE_NAMES.RENT_BOOKING_RECEIPT
            )
          : Promise.resolve(null),
        depositPaidAmount > 0
          ? baseRepo.getCurrentSequence(
              constants.SEQUENCE_NAMES.DEPOSIT_BOOKING_RECEIPT
            )
          : Promise.resolve(null),
      ]);

      const bookingNo = `${hallSeq.prefix}-${hallSeq.currentValue + 1}`;

      // Insert parent booking
      const bookingData = await baseRepo.insert(
        ep,
        {
          bookingNo,
          organiser,
          // purpose,
          phone,
          itsNo,
          submitter: userId,
          sadarat,
          mohalla,
          depositPaidAmount,
          paidAmount,
          jamaatLagat,
        },
        t
      );

      const bookingId = bookingData?.rows?.[0]?.id;
      if (!bookingId) throw new Error("Failed to create main booking.");

      // Prepare inserts
      const promises = [];

      // Hall booking sequence update
      promises.push(
        baseRepo.updateSequence(constants.SEQUENCE_NAMES.HALL_BOOKING, t)
      );

      // Hall bookings
      const hallBookingRows = enrichedBookings.map(
        ({ includeThaalCharges, ...hallProps }) => ({
          ...hallProps,
          bookingId,
          thaalAmount: includeThaalCharges
            ? calculateThaalAmount(
                hallProps.thaals,
                purposes[hallProps.purpose].perThaal
              )
            : 0,
        })
      );
      promises.push(
        models.hallBookings.bulkCreate(hallBookingRows, { transaction: t })
      );

      const receiptBase = {
        bookingId,
        organiser,
        organiserIts: itsNo,
        date: new Date(),
        mode: "CASH",
        createdBy: userId,
      };

      // Rent receipt
      if (paidAmount > 0 && rentReceiptSeq) {
        const receiptNo = `${rentReceiptSeq.prefix}-${
          rentReceiptSeq.currentValue + 1
        }`;
        promises.push(
          baseRepo.insert(
            "rentBookingReceipts",
            {
              ...receiptBase,
              amount: paidAmount,
              receiptNo,
              type: "RENT",
              mode,
              ref,
            },
            t
          ),
          baseRepo.updateSequence(
            constants.SEQUENCE_NAMES.RENT_BOOKING_RECEIPT,
            t
          )
        );
      }

      // Deposit receipt
      if (depositPaidAmount > 0 && depositReceiptSeq) {
        const receiptNo = `${depositReceiptSeq.prefix}-${
          depositReceiptSeq.currentValue + 1
        }`;
        promises.push(
          baseRepo.insert(
            "rentBookingReceipts",
            {
              ...receiptBase,
              amount: depositPaidAmount,
              receiptNo,
              mode: "CASH",
              type: "DEPOSIT",
            },
            t
          ),
          baseRepo.updateSequence(
            constants.SEQUENCE_NAMES.DEPOSIT_BOOKING_RECEIPT,
            t
          )
        );
      }

      // Execute all inserts/updates in parallel
      await Promise.all(promises);

      return bookingId;
    });

    sendResponse(
      res,
      { count: 1, rows: [{ id: result }] },
      constants.HTTP_STATUS_CODES.CREATED
    );
    // Async WhatsApp notification (non-blocking)
    if (phone) {
      const bookings = await baseRepo.findById(ep, "id", result, includeAll);
      const booking = bookings.rows?.[0] || {};
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

async function grantRaza(req, res) {
  let code;
  try {
    const response = await baseRepo.update(ep, req.params.id, {
      razaGranted: true,
    });

    if (response && response.count > 0) {
      sendResponse(res, response, constants.HTTP_STATUS_CODES.CREATED);
    } else {
      code = constants.HTTP_STATUS_CODES.BAD_REQUEST;
      throwError("Record does not exist", true);
    }
  } catch (err) {
    sendError(res, err, code);
  }
}

async function writeOffAmount(req, res) {
  let code;
  try {
    const bookings = await baseRepo.findById(
      ep,
      "id",
      req.params.id,
      includeAll
    );

    const booking = bookings.rows?.[0] || {};

    if (!booking.id) {
      code = constants.HTTP_STATUS_CODES.NOT_FOUND;
      throwError("Booking does not exist", true);
    }

    const purposeIds = booking.hallBookings.map((b) => b.purpose);

    const [bookingPurposeData] = await Promise.all([
      baseRepo.findAll("bookingPurpose", {
        filter: JSON.stringify({ id: purposeIds }),
      }),
    ]);

    const purposes = keyBy(bookingPurposeData.rows, "id");

    const { totalAmountPending } = calcBookingTotals({
      halls: booking.hallBookings.map((b) => ({
        ...b,
        perThaal: purposes[b.purpose].perThaal || 0,
        jamaatLagat: purposes[b.purpose].jamaatLagat || 0,
      })),
      ...booking,
    });

    if (totalAmountPending <= 0) {
      code = constants.HTTP_STATUS_CODES.BAD_REQUEST;
      throwError("No pending amount to write off", true);
    }

    const response = await baseRepo.update(ep, req.params.id, {
      writeOffAmount: totalAmountPending,
    });

    if (response && response.count > 0) {
      sendResponse(res, response, constants.HTTP_STATUS_CODES.CREATED);
    } else {
      code = constants.HTTP_STATUS_CODES.BAD_REQUEST;
      throwError("Record does not exist", true);
    }
  } catch (err) {
    sendError(res, err, code);
  }
}

async function closeBooking(req, res) {
  let code;
  try {
    const { actualThaals, comments, extraExpenses } = req.body;
    await sequelize.transaction(async (t) => {
      const promises = [];
      Object.entries(actualThaals).forEach(([hallId, count]) => {
        if (count > 0) {
          promises.push(
            baseRepo.update("hallBookings", hallId, { thaals: count }),
            t
          );
        }
      });

      promises.push(
        baseRepo.update(
          ep,
          req.params.id,
          {
            comments,
            extraExpenses,
            checkedOutOn: new Date(),
          },
          t
        )
      );

      await Promise.all(promises);
      return true;
    });

    sendResponse(
      res,
      [{ id: req.params.id }],
      constants.HTTP_STATUS_CODES.CREATED
    );
  } catch (err) {
    sendError(res, err, code);
  }
}

async function settleRefund(req, res) {
  let code;
  try {
    const bookings = await baseRepo.findById(
      ep,
      "id",
      req.params.id,
      includeAll
    );

    const booking = bookings.rows?.[0] || {};

    if (!booking.id) {
      code = constants.HTTP_STATUS_CODES.NOT_FOUND;
      throwError("Booking does not exist", true);
    }

    const purposeIds = booking.hallBookings.map((b) => b.purpose);

    const [bookingPurposeData] = await Promise.all([
      baseRepo.findAll("bookingPurpose", {
        filter: JSON.stringify({ id: purposeIds }),
      }),
    ]);

    const purposes = keyBy(bookingPurposeData.rows, "id");

    const { refundAmount } = calcBookingTotals({
      halls: booking.hallBookings.map((b) => ({
        ...b,
        perThaal: purposes[b.purpose].perThaal || 0,
        jamaatLagat: purposes[b.purpose].jamaatLagat || 0,
      })),
      ...booking,
    });
    if (refundAmount <= 0) {
      code = constants.HTTP_STATUS_CODES.BAD_REQUEST;
      throwError("Refund amount to be collected. Cannot be settled", true);
    }

    const response = await baseRepo.update(ep, req.params.id, {
      refundReturnAmount: refundAmount,
      refundReturnedOn: new Date(),
    });

    if (response && response.count > 0) {
      sendResponse(res, response, constants.HTTP_STATUS_CODES.CREATED);
    } else {
      code = constants.HTTP_STATUS_CODES.BAD_REQUEST;
      throwError("Record does not exist", true);
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
  grantRaza,
  writeOffAmount,
  closeBooking,
  settleRefund,
};
