const express = require("express");

// controllers
const controller = require("./controller");

const router = express.Router();

router.post("/iclock/cdata.aspx", controller.iclock);

module.exports = router;
