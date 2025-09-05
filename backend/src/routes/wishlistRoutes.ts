import { Router } from "express";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controller/wishlistController.js";
import { requireAuth, requireSelfOrAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/:userId", requireSelfOrAdmin, getWishlist);

router.post("/add", requireAuth, addToWishlist);

router.delete("/remove", requireAuth, removeFromWishlist);

export default router;