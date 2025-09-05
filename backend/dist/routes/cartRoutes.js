"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_js_1 = require("../controller/cartController.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = express_1.default.Router();
router.get('/:userId', authMiddleware_js_1.requireSelfOrAdmin, cartController_js_1.getUserCart);
router.post('/', authMiddleware_js_1.requireAuth, cartController_js_1.addToCart);
router.put('/:userId/:productId', authMiddleware_js_1.requireSelfOrAdmin, cartController_js_1.updateCartItem);
router.delete('/:userId/:productId', authMiddleware_js_1.requireSelfOrAdmin, cartController_js_1.removeFromCart);
// self or admin only
router.delete('/:userId', authMiddleware_js_1.requireSelfOrAdmin, cartController_js_1.clearCart);
exports.default = router;
//# sourceMappingURL=cartRoutes.js.map