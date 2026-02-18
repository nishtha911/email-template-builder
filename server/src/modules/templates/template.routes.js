const router = require("express").Router();
const controller = require("./template.controller");
const authMiddleware = require("../../middleware/auth.middleware");

router.post("/save", authMiddleware, controller.saveTemplate);
router.get("/all", authMiddleware, controller.getTemplates);
router.get("/:id", authMiddleware, controller.getTemplateById);
router.delete("/:id", authMiddleware, controller.deleteTemplate); 
module.exports = router;