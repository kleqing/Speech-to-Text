import fs from "fs/promises";
import { transcribeAudioFile } from "../services/stt.service.js";

const sendTranscriptResponse = async (req, res) => {
    const filePath = req.file?.path;

    if (!filePath) {
        res.status(400).json({
            error: "No audio file provided. Use form-data field name: audio",
        });
        return;
    }

    try {
        const transcript = await transcribeAudioFile(filePath);

        res.status(200).json({
            transcript,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Failed to transcribe audio.",
        });
    } finally {
        await fs.unlink(filePath).catch(() => {
            // Ignore file cleanup failures so response is not blocked.
        });
    }
};

export const handleFileSpeechToText = async (req, res) => {
    await sendTranscriptResponse(req, res);
};

export const handleMicrophoneSpeechToText = async (req, res) => {
    await sendTranscriptResponse(req, res);
};

