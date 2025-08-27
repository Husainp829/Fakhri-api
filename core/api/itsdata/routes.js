const express = require("express");

// middlewares
const { authenticate } = require("../../middleware/authentication");
const permissionMiddleware = require("../../middleware/permissionCheck");
const { PERMISSIONS } = require("../../const/constants");
// controllers
const controller = require("./controller");

const router = express.Router();

router.get("/", authenticate, permissionMiddleware(PERMISSIONS.VIEW_ITS_DATA), controller.findAll);

router.get(
  "/:id",
  authenticate,
  permissionMiddleware(PERMISSIONS.VIEW_ITS_DATA),
  controller.findById
);
router.post("/", authenticate, controller.insert);
router.post(
  "/upload",
  // authenticate,
  // permissionMiddleware(PERMISSIONS.VIEW_ITS_DATA),
  controller.upload
);
module.exports = router;
