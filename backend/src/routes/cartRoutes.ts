import express from 'express';
import {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controller/cartController.js';
import { requireAuth, requireSelfOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userId', requireSelfOrAdmin, getUserCart);
router.post('/', requireAuth, addToCart);
router.put('/:userId/:productId', requireSelfOrAdmin, updateCartItem);
router.delete('/:userId/:productId', requireSelfOrAdmin, removeFromCart);
// self or admin only
router.delete('/:userId', requireSelfOrAdmin, clearCart);

export default router;