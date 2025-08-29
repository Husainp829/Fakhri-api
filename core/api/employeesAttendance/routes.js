const express = require("express");

// middlewares
const { authenticate } = require("../../middleware/authentication");

// controllers
const controller = require("./controller");

const router = express.Router();

router.get("/", authenticate, controller.getMonthAttendance);

module.exports = router;
