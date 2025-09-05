"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_js_1 = require("../controller/productController.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = express_1.default.Router();
router.get('/', authMiddleware_js_1.optionalAuth, productController_js_1.getProducts);
router.get('/:id', productController_js_1.getProductById);
router.post('/', authMiddleware_js_1.requireAdmin, productController_js_1.createProducts);
router.put('/:id', authMiddleware_js_1.requireAdmin, productController_js_1.updateProduct);
router.delete('/:id', authMiddleware_js_1.requireAdmin, productController_js_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map