import { Router } from "express";
import * as controller from "./auth.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import { registerValidation } from "./auth.validation.js";

const router = Router();

router.post("/register", registerValidation, controller.register);
router.post("/login", controller.login);

router.get("/me", authMiddleware, controller.getMe);

router.post("/forgot-password", controller.forgotPassword);
router.put("/reset-password/:token", controller.resetPassword);

export default router;
