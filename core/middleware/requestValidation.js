const logger = require("../const/winston");
const constants = require("../const/constants");
const { decoded } = require("../api/base/schema");

const middleware = (schema, property = "body") => (req, res, next) => {
  const { error: e } = decoded.validate(req.decoded);
  if (e === undefined) {
    const { value, error } = schema.validate(req[property], { stripUnknown: true });
    if (error === undefined) {
      logger.info("Request: ", JSON.stringify(value));
      next();
    } else {
      sendError(res, error, constants.HTTP_STATUS_CODES.FORBIDDEN);
    }
  } else {
    sendError(res, e, constants.HTTP_STATUS_CODES.FORBIDDEN);
  }
};

module.exports = middleware;
