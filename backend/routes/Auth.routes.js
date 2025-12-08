import express from "express";
import { signup, login, getAccount } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/account", authMiddleware, getAccount);

export default router;

