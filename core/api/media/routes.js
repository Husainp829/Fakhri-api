const express = require("express");
const { authenticate } = require("../../middleware/authentication");

const router = express.Router();

// controllers
const controller = require("./controller");

// Google Drive Token
router.post("/media/upload", authenticate, controller.upload);

module.exports = router;
