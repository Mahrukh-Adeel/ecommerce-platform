"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_js_1 = require("../controller/userController.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = express_1.default.Router();
router.get('/', authMiddleware_js_1.requireAdmin, userController_js_1.getAllUsers);
router.get('/:id', authMiddleware_js_1.requireSelfOrAdmin, userController_js_1.getUserById);
router.get('/profile/me', authMiddleware_js_1.requireAuth, userController_js_1.getUserProfile);
router.put('/:id', authMiddleware_js_1.requireSelfOrAdmin, userController_js_1.updateUser);
router.put('/:id/role', authMiddleware_js_1.requireAdmin, userController_js_1.updateUserRole);
router.delete('/:id', authMiddleware_js_1.requireAdmin, userController_js_1.deleteUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map