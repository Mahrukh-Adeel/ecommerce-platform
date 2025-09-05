"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wishlistController_js_1 = require("../controller/wishlistController.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
router.get("/:userId", authMiddleware_js_1.requireSelfOrAdmin, wishlistController_js_1.getWishlist);
router.post("/add", authMiddleware_js_1.requireAuth, wishlistController_js_1.addToWishlist);
router.delete("/remove", authMiddleware_js_1.requireAuth, wishlistController_js_1.removeFromWishlist);
exports.default = router;
//# sourceMappingURL=wishlistRoutes.js.map