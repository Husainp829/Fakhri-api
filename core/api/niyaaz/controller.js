const { Op } = require("sequelize");
const baseRepo = require("../base/repo");
const constants = require("../../const/constants");
const { sequelize } = require("../../../models");
const meta = require("./meta");
const models = require("../../../models");
const { getGentsLadiesCount } = require("../../utils/helper");

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
  if (query.search) {
    query.where = {
      [Op.or]: [
        { HOFId: { [Op.like]: `%${query.search}%` } },
        { HOFName: { [Op.like]: `%${query.search}%` } },
        { formNo: { [Op.like]: `%${query.search}%` } },
      ],
    };
    delete query.search;
  }
  if (query.markaz) {
    query.where = {
      ...query.where,
      markaz: { [Op.eq]: query.markaz },
    };
    delete query.markaz;
  }
  if (query.namaazVenue) {
    query.where = {
      ...query.where,
      namaazVenue: { [Op.eq]: query.namaazVenue },
    };
    delete query.namaazVenue;
  }
  if (decoded.eventId) {
    query.where = {
      ...query.where,
      eventId: { [Op.eq]: decoded.eventId },
    };
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
      namaazVenue,
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
      formNo,
      submitter,
    } = body;
    const sequenceName = `${constants.SEQUENCE_NAMES.NIYAAZ}_${markaz}`;
    const { currentValue, prefix } = (await baseRepo.getCurrentSequence(sequenceName)) || {};
    const result = await sequelize.transaction(async (t) => {
      const formN = formNo || `${prefix}-${markaz}-${currentValue + 1}`;
      const { gentsCount, ladiesCount } = getGentsLadiesCount(familyMembers);
      const niyaazData = await baseRepo.insert(
        ep,
        {
          eventId,
          markaz,
          namaazVenue,
          HOFId,
          HOFName,
          HOFAddress,
          HOFPhone,
          familyMembers,
          takhmeenAmount,
          paidAmount,
          zabihat,
          formNo: formN,
          iftaari,
          chairs,
          gentsCount,
          ladiesCount,
          submitter: submitter || userId,
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
            namaazVenue,
            total: paidAmount,
            createdBy: userId,
          },
          t
        );
        await baseRepo.updateSequence(constants.SEQUENCE_NAMES.RECEIPT_NIYAAZ, t);
      }

      // update in sequence
      await baseRepo.updateSequence(sequenceName, t);
      return formN;
    });
    sendResponse(res, { count: 1, rows: [{ id: result }] }, constants.HTTP_STATUS_CODES.CREATED);
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
    const { gentsCount, ladiesCount } = getGentsLadiesCount(body.familyMembers);
    const bodyParams = {
      ...body,
      gentsCount,
      ladiesCount,
    };
    const response = await baseRepo.update(ep, req.params.id, bodyParams);
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
