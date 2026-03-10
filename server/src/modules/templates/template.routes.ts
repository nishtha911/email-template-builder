import { Router } from "express";
import * as controller from "./template.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/save", authMiddleware, controller.saveTemplate);
router.get("/all", authMiddleware, controller.getTemplates);
router.get("/:id", authMiddleware, controller.getTemplateById);
router.delete("/:id", authMiddleware, controller.deleteTemplate);
export default router;