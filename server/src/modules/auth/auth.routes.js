const router = require("express").Router();
const controller = require("./auth.controller"); // Make sure this only appears ONCE

router.post("/register", controller.register);

module.exports = router;