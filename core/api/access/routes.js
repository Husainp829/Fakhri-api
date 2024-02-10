const express = require("express");

const router = express.Router();

// controllers
const controller = require("./controller");

// Google Drive Token
router.get("/addEvent", controller.addEvent);

module.exports = router;
