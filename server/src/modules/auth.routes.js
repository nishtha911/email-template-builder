const router = require("express").Router();
const controller = require("./auth.controller");
const { registerValidation } = require("./auth.validation");

router.post("/register", registerValidation, controller.register);

module.exports = router;
