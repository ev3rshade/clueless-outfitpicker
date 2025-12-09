import express from "express";
import {
  generateOutfit,
  saveOutfit,
  deleteOutfit,
  getOutfit,
} from "../controllers/outfit.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/outfits/generate", authMiddleware, generateOutfit);
router.post("/outfits", authMiddleware, saveOutfit);
router.get("/outfits/:id", authMiddleware, getOutfit);
router.delete("/outfits/:id", authMiddleware, deleteOutfit);

export default router;