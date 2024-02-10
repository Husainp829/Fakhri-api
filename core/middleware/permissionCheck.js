const constants = require("../const/constants");

const permissionMiddleware = (perm) => (req, res, next) => {
  const { permissions } = req.decoded;
  if (permissions.includes(perm)) {
    next();
  } else {
    sendError(res, "Unauthorized access", constants.HTTP_STATUS_CODES.FORBIDDEN);
  }
};

module.exports = permissionMiddleware;
