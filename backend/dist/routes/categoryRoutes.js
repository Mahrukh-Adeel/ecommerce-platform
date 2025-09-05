"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_js_1 = require("../controller/categoryController.js");
const categoryMiddleware_js_1 = require("../middleware/categoryMiddleware.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_js_1.optionalAuth, categoryController_js_1.getCategories);
router.get("/:categoryId/products", authMiddleware_js_1.optionalAuth, categoryMiddleware_js_1.validateCategory, categoryController_js_1.getProductsByCategory);
router.get("/:categoryId", authMiddleware_js_1.optionalAuth, categoryMiddleware_js_1.validateCategory, categoryController_js_1.getCategoryById);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map