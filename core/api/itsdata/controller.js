const readXlsxFile = require("read-excel-file/node");
const uploadSchema = require("./uploadSchema");
const baseRepo = require("../base/repo");
const { sequelize } = require("../../../models");
const constants = require("../../const/constants");
const models = require("../../../models");
const meta = require("./meta");

const ep = meta.ENDPOINT;
const includeParams = [
  {
    model: models.itsdataupload,
    as: "familyMembers",
  },
];

async function findAll(req, res) {
  const { query } = req;

  const { q } = query;
  if (query.q) {
    query.ITS_ID = q;
    if (query.includeFamily) {
      query.include = includeParams;
    }
    delete query.q;
    delete query.includeFamily;
  }
  if (query.isHOF) {
    query.HOF_FM_TYPE = "HOF";
    delete query.isHOF;
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
    const data = await baseRepo.findById(ep, "id", req.params.id);
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

function insert(req, res) {
  const { body } = req;
  const params = body;

  baseRepo
    .insert(ep, params)
    .then((response) => {
      sendResponse(res, response, constants.HTTP_STATUS_CODES.CREATED);
    })
    .catch((err) => {
      sendError(res, err, constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    });
}

async function upload(req, res) {
  try {
    const { base64Image } = req.body;
    const fileBuffer = Buffer.from(base64Image, "base64");
    const data = await readXlsxFile(fileBuffer, {
      schema: uploadSchema,
      ignoreEmptyRows: false,
    }).then((row) => row);
    const transaction = await sequelize.transaction();
    const result = await models.itsdataupload.bulkCreate(
      data?.rows.map((row) => ({ id: row.ITS_ID, ...row })),
      { raw: true, transaction }
    );
    await transaction.commit();

    sendResponse(res, { count: result.length }, constants.HTTP_STATUS_CODES.OK);
  } catch (e) {
    sendError(res, e.message, constants.HTTP_STATUS_CODES.BAD_REQUEST);
  }

  // Set the parameters for S3 upload
  // const params = {
  //   Bucket: process.env.DO_SPACES_NAME,
  //   ACL: "public-read",
  //   Key: fullPath,
  //   Body: imageBuffer,
  //   ContentType: contentType,
  // };

  // // Upload the image to S3
  // s3.upload(params, (error, data) => {
  //   if (error) {
  //     return sendError(res, error.message, constants.HTTP_STATUS_CODES.BAD_REQUEST);
  //   }
  //   return sendResponse(res, { image: data.Location }, constants.HTTP_STATUS_CODES.OK);
  // });
}

module.exports = {
  findAll,
  findById,
  insert,
  upload,
};
