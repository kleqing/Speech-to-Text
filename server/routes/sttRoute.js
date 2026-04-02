import express from "express";
import upload from "../middleware/upload.middleware.js";
import { handleFileSpeechToText } from "../controllers/file-stt.controller.js";
import { handleMicrophoneSpeechToText } from "../controllers/mic-stt.controller.js";

const router = express.Router();

router.post("/stt/file", upload.single("audio"), handleFileSpeechToText);
router.post("/stt/mic", upload.single("audio"), handleMicrophoneSpeechToText);

export default router;