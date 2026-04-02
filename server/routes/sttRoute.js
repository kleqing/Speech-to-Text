import express from "express";
import upload from "../middleware/upload.middleware.js";
import { handleFileSpeechToText } from "../controllers/file-stt.controller.js";
import { handleMicrophoneSpeechToText } from "../controllers/mic-stt.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { sttLimiter } from "../middleware/rate-limit.middleware.js";

const router = express.Router();

router.post("/stt/file", requireAuth, sttLimiter, upload.single("audio"), handleFileSpeechToText);
router.post("/stt/mic", requireAuth, sttLimiter, upload.single("audio"), handleMicrophoneSpeechToText);

export default router;