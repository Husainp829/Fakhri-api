const constants = require("../../const/constants");
const { generateToken } = require("../../middleware/authentication");

function addEvent(req, res) {
  const token = generateToken();
  sendResponse(res, { token }, constants.HTTP_STATUS_CODES.OK);
}

module.exports = {
  addEvent,
};
