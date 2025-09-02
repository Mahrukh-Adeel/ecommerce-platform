import { Router } from "express";
import { getCategories, getCategoryById, getProductsByCategory } from '../controller/categoryController.js';
import { validateCategory } from '../middleware/categoryMiddleware.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get("/", optionalAuth, getCategories);
router.get("/:categoryId/products", optionalAuth, validateCategory, getProductsByCategory);
router.get("/:categoryId", optionalAuth, validateCategory, getCategoryById);

export default router;