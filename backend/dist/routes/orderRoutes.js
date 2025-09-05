"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_js_1 = require("../controller/orderController.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = express_1.default.Router();
router.get('/', authMiddleware_js_1.requireAdmin, orderController_js_1.getAllOrders);
router.get('/user/:userId', authMiddleware_js_1.requireSelfOrAdmin, orderController_js_1.getOrdersByUser);
router.get('/:id', authMiddleware_js_1.requireAuth, orderController_js_1.getOrderById);
router.post('/', authMiddleware_js_1.requireAuth, orderController_js_1.createOrder);
router.put('/:id/status', authMiddleware_js_1.requireAdmin, orderController_js_1.updateOrderStatus);
router.delete('/:id', authMiddleware_js_1.requireAuth, orderController_js_1.deleteOrder);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map