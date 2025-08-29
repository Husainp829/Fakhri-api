const constants = require("../../const/constants");

async function iclock(req, res) {
  try {
    // If you're using express with bodyParser.text()
    console.log("Headers:", req.headers);
    console.log("Query Params:", req.query);
    console.log("Raw Body:", req.body);

    // Always send back a success response so the device knows data was received
    sendResponse(res, {}, constants.HTTP_STATUS_CODES.CREATED);
  } catch (error) {
    console.error("Error in iclock handler:", error);
    sendError(res, error, constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  iclock,
};
