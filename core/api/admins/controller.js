const admin = require("firebase-admin");
const baseRepo = require("../base/repo");
const constants = require("../../const/constants");
const meta = require("./meta");

const ep = meta.ENDPOINT;

async function findAll(req, res) {
  const { query } = req;

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
      const { rows } = data;
      const [row] = rows || [{ uid: "" }];
      const claims =
        (await admin
          .auth()
          .getUser(row.uid)
          .then((userRecord) => userRecord.customClaims)) || {};
      const permissions = claims.permissions || [];
      const response = {
        count: data.count,
        rows: rows.map((r) => ({ ...r, permissions })),
      };
      sendResponse(res, response, constants.HTTP_STATUS_CODES.OK);
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
  try {
    const uid = await admin
      .auth()
      .createUser({
        email: body.email,
        password: body.password,
      })
      .then((user) => user.uid)
      .catch((err) => {
        sendError(res, err, constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
      });
    const params = {
      name: body.name,
      email: body.email,
      uid,
    };
    const user = await baseRepo.insert(ep, params);
    const userId = user?.rows?.[0].id;

    await admin.auth().setCustomUserClaims(uid, {
      permissions: body.permissions,
      userId,
    });
    sendResponse(res, user, constants.HTTP_STATUS_CODES.CREATED);
  } catch (err) {
    sendError(res, err, constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

async function update(req, res) {
  let code;

  try {
    const { body } = req;

    const data = await baseRepo.findById(ep, "id", req.params.id);
    const { permissions: userPerms, ...other } = body;
    const { rows } = data;
    if (data.count) {
      const response = await baseRepo.update(ep, req.params.id, other);
      const [row] = rows || [{ uid: "" }];
      await admin.auth().setCustomUserClaims(row.uid, {
        permissions: userPerms,
        userId: req.params.id,
      });
      await admin.auth().revokeRefreshTokens(row.uid);
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
    const data = await baseRepo.findById(ep, "id", req.params.id);
    if (data.count) {
      const { rows } = data;
      const [row] = rows || [{ uid: "" }];
      baseRepo.remove(ep, id);
      await admin.auth().deleteUser(row.uid);
      sendResponse(res, data, constants.HTTP_STATUS_CODES.OK);
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
