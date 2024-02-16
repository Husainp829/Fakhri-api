const repo = require("./repo");
const constants = require("../../const/constants");

const include = [];

async function getEventStats(req, res) {
  try {
    const { query, decoded } = req;
    query.include = include;

    const niyaazCounts = await repo.getNiyaazCounts(decoded).then((response) => response);
    const dayWiseReceiptReport = await repo
      .getDayWiseReceiptReport(decoded)
      .then((response) => response);

    const data = {
      niyaazCounts,
      dayWiseReceiptReport,
    };

    sendResponse(res, data, constants.HTTP_STATUS_CODES.OK);
  } catch (err) {
    sendError(res, err, constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  getEventStats,
};
