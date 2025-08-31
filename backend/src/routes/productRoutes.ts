import express from 'express';
import {
  getProducts,
  getProductById,
  createProducts,
  updateProduct,
  deleteProduct
} from '../controller/productController.js';
import { optionalAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getProducts);
router.get('/:id', getProductById);
router.post('/', requireAdmin, createProducts);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

export default router;