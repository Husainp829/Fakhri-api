/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const express = require("express");
// const auth = require('../middleware/authentication');

const router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  sendResponse(res, { status: "success" });
});

router.use("/admins", require("../api/admins/routes"));
router.use("/events", require("../api/events/routes"));
router.use("/itsdata", require("../api/itsdata/routes"));
router.use("/itsdata1", require("../api/itsdata/routes"));
router.use("/niyaaz", require("../api/niyaaz/routes"));
router.use("/receipts", require("../api/receipt/routes"));
router.use("/sabilData", require("../api/sabilData/routes"));
router.use("/sabilReceipt", require("../api/sabilReceipt/routes"));
router.use("/sabilAudit", require("../api/sabilAudit/routes"));
router.use("/sabilTakhmeen", require("../api/sabilTakhmeen/routes"));
router.use("/sabilChangeRequests", require("../api/sabilChangeRequest/routes"));
router.use("/fmbData", require("../api/fmbData/routes"));
router.use("/fmbReceipt", require("../api/fmbReceipt/routes"));
router.use("/fmbTakhmeen", require("../api/fmbTakhmeen/routes"));
router.use("/mohallas", require("../api/mohallas/routes"));
router.use("/lagatTypes", require("../api/lagatTypes/routes"));
router.use("/stats", require("../api/stats/routes"));

module.exports = router;
