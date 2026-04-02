import express from "express";
import { handleLogin } from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rate-limit.middleware.js";

const router = express.Router();

router.post("/login", authLimiter, handleLogin);

export default router;

