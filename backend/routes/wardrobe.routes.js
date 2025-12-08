import express from "express";
import {
  getWardrobe,
  addWardrobeItem,
  updateWardrobeItem,
  deleteWardrobeItem,
} from "../controllers/wardrobe.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from "../config/multer.config.js";

const router = express.Router();

router.get("/wardrobe", authMiddleware, getWardrobe);
router.post("/wardrobe", authMiddleware, upload.single("image"), addWardrobeItem);
router.put("/wardrobe/:id", authMiddleware, updateWardrobeItem);
router.delete("/wardrobe/:id", authMiddleware, deleteWardrobeItem);

export default router;

