import { transcribeAudioBuffer } from "../services/stt.service.js";

export const handleMicrophoneSpeechToText = async (req, res) => {
    const audioBuffer = req.file?.buffer;

    if (!audioBuffer) {
        res.status(400).json({
            error: "No audio file provided. Use form-data field name: audio",
        });
        return;
    }

    try {
        const transcript = await transcribeAudioBuffer({
            inputBuffer: audioBuffer,
            originalName: req.file?.originalname,
            mimeType: req.file?.mimetype,
        });
        res.status(200).json({ transcript });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Failed to transcribe audio.",
        });
    }
};

