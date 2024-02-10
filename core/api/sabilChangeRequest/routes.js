const express = require("express");

// middlewares
const reqValidator = require("../../middleware/requestValidation");
const { authenticate } = require("../../middleware/authentication");

// schemas
const schema = require("./schema");

// controllers
const controller = require("./controller");

const router = express.Router();

router.get("/", authenticate, controller.findAll);
router.get("/:id", authenticate, controller.findById);
router.post("/", authenticate, reqValidator(schema.insert), controller.insert);
router.put("/approve/:id", authenticate, controller.approve);
router.put("/decline/:id", authenticate, controller.decline);
module.exports = router;
