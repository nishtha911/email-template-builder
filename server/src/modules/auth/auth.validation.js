const { body } = require("express-validator");
exports.registerValidation = [
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be 6+ characters")
];