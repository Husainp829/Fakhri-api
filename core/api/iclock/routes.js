const express = require("express");

// controllers
const controller = require("./controller");

const router = express.Router();

router.post("/", controller.iclock);

module.exports = router;
