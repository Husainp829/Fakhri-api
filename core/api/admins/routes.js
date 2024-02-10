const express = require("express");

// middlewares
const { authenticate } = require("../../middleware/authentication");

// controllers
const controller = require("./controller");
const permissionMiddleware = require("../../middleware/permissionCheck");
const { PERMISSIONS } = require("../../const/constants");

const router = express.Router();

router.get(
  "/",
  authenticate,
  permissionMiddleware(PERMISSIONS.ADMINS_VIEW),
  controller.findAll
);
router.get(
  "/:id",
  authenticate,
  permissionMiddleware(PERMISSIONS.ADMINS_VIEW),
  controller.findById
);
router.post(
  "/",
  authenticate,
  permissionMiddleware(PERMISSIONS.ADMINS_CREATE),
  controller.insert
);
router.put(
  "/:id",
  authenticate,
  permissionMiddleware(PERMISSIONS.ADMINS_EDIT),
  controller.update
);
router.delete(
  "/:id",
  authenticate,
  permissionMiddleware(PERMISSIONS.ADMINS_DELETE),
  controller.remove
);
module.exports = router;
