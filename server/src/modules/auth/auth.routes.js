const router = require("express").Router();
const controller = require("./auth.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const { registerValidation } = require("./auth.validation");

router.post("/register", registerValidation, controller.register);
router.post("/login", controller.login);

router.get("/me", authMiddleware, controller.getMe);

router.post("/forgot-password", controller.forgotPassword);
router.put("/reset-password/:token", controller.resetPassword);

module.exports = router;
