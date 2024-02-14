const { Op } = require("sequelize");
const baseRepo = require("../base/repo");
const constants = require("../../const/constants");
const { sequelize } = require("../../../models");
const meta = require("./meta");
const models = require("../../../models");

const ep = meta.ENDPOINT;
const receipt = "receipts";
const include = [
  {
    model: models.admins,
    as: "admin",
  },
];

const includeFind = [
  {
    model: models.admins,
    as: "admin",
  },
  {
    model: models.events,
    as: "event",
  },
];

async function findAll(req, res) {
  const { query, decoded } = req;
  query.include = include;
  if (decoded.eventId) {
    query.eventId = decoded.eventId;
  }
  if (query.search) {
    query.HOFId = query.search;
    delete query.search;
  }
  if (query.includeEventData) {
    query.include = [
      ...query.include,
      {
        model: models.events,
        as: "event",
      },
    ];
    delete query.includeEventData;
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
    const data = await baseRepo.findById(ep, "id", req.params.id, includeFind);
    if (data.count) {
      const row = data.rows[0];
      const hofId = row.HOFId;
      const currEventId = row.eventId;
      const allPreviousNiyaaz = await baseRepo.findAll(ep, {
        where: {
          hofId,
          eventId: { [Op.ne]: currEventId },
        },
        include: [
          {
            model: models.events,
            as: "event",
          },
        ],
      });
      if (allPreviousNiyaaz.count) {
        row.previousNiyaazHistory = allPreviousNiyaaz.rows;
      }
      sendResponse(res, { count: data.count, rows: [row] }, constants.HTTP_STATUS_CODES.OK);
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
    const {
      markaz,
      HOFId,
      HOFName,
      HOFAddress,
      HOFPhone,
      familyMembers,
      takhmeenAmount,
      zabihat,
      iftaari,
      chairs,
      comments,
      paidAmount,
      mode,
      details,
    } = body;
    const { currentValue, prefix } =
      (await baseRepo.getCurrentSequence(constants.SEQUENCE_NAMES.NIYAAZ)) || {};
    const result = await sequelize.transaction(async (t) => {
      const formN = `${prefix}-${markaz}-${currentValue + 1}`;
      const niyaazData = await baseRepo.insert(
        ep,
        {
          eventId,
          markaz,
          HOFId,
          HOFName,
          HOFAddress,
          HOFPhone,
          familyMembers,
          takhmeenAmount,
          zabihat,
          formNo: formN,
          iftaari,
          chairs,
          submitter: userId,
          comments,
        },
        t
      );
      // add receipt
      const niyaazId = niyaazData?.rows[0]?.id;

      if (paidAmount > 0) {
        const { currentValue: receiptVal, prefix: receiptPrefix } =
          (await baseRepo.getCurrentSequence(constants.SEQUENCE_NAMES.RECEIPT_NIYAAZ)) || {};
        const receiptN = `${receiptPrefix}-${receiptVal + 1}`;

        await baseRepo.insert(
          receipt,
          {
            eventId,
            niyaazId,
            formNo: formN,
            receiptNo: receiptN,
            HOFId,
            HOFName,
            date: new Date(),
            mode,
            details,
            amount: paidAmount,
            markaz,
            total: paidAmount,
          },
          t
        );
        await baseRepo.updateSequence(constants.SEQUENCE_NAMES.RECEIPT_NIYAAZ, t);
      }

      // update in sequence
      await baseRepo.updateSequence(constants.SEQUENCE_NAMES.NIYAAZ, t);
      return niyaazData;
    });
    sendResponse(res, result, constants.HTTP_STATUS_CODES.CREATED);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      sendError(
        res,
        { ...error, message: "HOF already exists for this event and markaz." },
        constants.HTTP_STATUS_CODES.ALREADY_EXISTS
      );
    } else {
      sendError(res, error, constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
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
