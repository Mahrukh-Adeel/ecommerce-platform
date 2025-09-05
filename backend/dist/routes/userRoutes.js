import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, getUserProfile, updateUserRole } from '../controller/userController.js';
import { requireAuth, requireAdmin, requireSelfOrAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/', requireAdmin, getAllUsers);
router.get('/:id', requireSelfOrAdmin, getUserById);
router.get('/profile/me', requireAuth, getUserProfile);
router.put('/:id', requireSelfOrAdmin, updateUser);
router.put('/:id/role', requireAdmin, updateUserRole);
router.delete('/:id', requireAdmin, deleteUser);
export default router;
//# sourceMappingURL=userRoutes.js.map