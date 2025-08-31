import express from 'express';
import {
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder
} from '../controller/orderController.js';
import { requireAuth, requireAdmin, requireSelfOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireAdmin, getAllOrders);
router.get('/user/:userId', requireSelfOrAdmin, getOrdersByUser);
router.get('/:id', requireAuth, getOrderById);
router.post('/', requireAuth, createOrder);
router.put('/:id/status', requireAdmin, updateOrderStatus);
router.delete('/:id', requireAuth, deleteOrder);

export default router;