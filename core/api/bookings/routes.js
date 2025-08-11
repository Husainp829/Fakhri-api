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
router.put("/:id/grant-raza", authenticate, controller.grantRaza);
router.put("/:id/write-off", authenticate, controller.writeOffAmount);
router.put("/:id/close", authenticate, reqValidator(schema.closeBooking), controller.closeBooking);
router.put("/:id", authenticate, reqValidator(schema.update), controller.update);
router.delete("/:id", authenticate, controller.remove);
module.exports = router;
