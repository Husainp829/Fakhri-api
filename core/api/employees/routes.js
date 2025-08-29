const express = require("express");

// middlewares
const { authenticate } = require("../../middleware/authentication");

// controllers
const controller = require("./controller");

const router = express.Router();

router.get("/", authenticate, controller.findAll);
router.get("/:id", authenticate, controller.findById);
router.post("/", authenticate, controller.insert);
router.put("/:id", authenticate, controller.update);
router.delete("/:id", authenticate, controller.remove);
module.exports = router;
