const router = require("express").Router();
const controller = require("./auth.controller");
const { registerValidation } = require("./auth.validation");
const { validationResult } = require("express-validator");

router.post(
  "/register",
  registerValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  controller.register
);

router.post("/login", controller.login);

module.exports = router;
