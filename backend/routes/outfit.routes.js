import express from "express";
import { generateOutfit } from "../controllers/outfit.controller.js";

const router = express.Router();

router.post("/outfit", generateOutfit);

export default router;

