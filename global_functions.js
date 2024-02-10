const logger = require("./core/const/winston");
const constants = require("./core/const/constants");

global.throwError = (err, log) => {
  // TE stands for Throw Error
  if (log === true) {
    logger.error(err);
  }

  throw new Error(err);
};

global.sendError = (res, err, code) => {
  let error;
  // Error Web Response
  if (typeof err === "object" && typeof err.message !== "undefined") error = err.message;
  else error = err;

  if (typeof code !== "undefined") res.statusCode = code;
  else res.statusCode = constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

  logger.error(`Error: ${err.message}`);
  logger.error(`Stack: ${err.stack}`);

  return res.json({ message: error });
};

global.sendResponse = (res, data, code) => {
  // Success Web Response

  if (typeof code !== "undefined") res.statusCode = code;
  else res.statusCode = constants.HTTP_STATUS_CODES.OK;

  if (data) {
    logger.info(`Response: ${JSON.stringify(data)}`);
    return res.json(data);
  }

  return res.sendStatus(res.statusCode);
};

global.sendResponseText = (res, data, code) => {
  // Success Web Response

  if (typeof code !== "undefined") res.statusCode = code;
  else res.statusCode = constants.HTTP_STATUS_CODES.OK;

  // logger.info(`Response: ${data}`);
  return res.send(data);
};

global.sendResponseImage = (res, data, code) => {
  // Success Web Response
  if (typeof code !== "undefined") res.statusCode = code;
  else res.statusCode = constants.HTTP_STATUS_CODES.OK;

  res.type("image/png");
  return res.send(data);
};
