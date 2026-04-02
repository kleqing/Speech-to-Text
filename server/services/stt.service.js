import fs from "fs";
import fsp from "fs/promises";
import os from "os";
import path from "path";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";
import { DeepgramClient } from "@deepgram/sdk";

const extractTranscript = (response) => {
    const payload = response?.result ?? response;
    return payload?.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim() ?? "";
};

const inferExtension = (originalName, mimeType) => {
    const fromName = originalName?.includes(".")
        ? originalName.slice(originalName.lastIndexOf(".") + 1).toLowerCase()
        : "";

    if (fromName) {
        return fromName;
    }

    const byMimeType = {
        "audio/mpeg": "mp3",
        "audio/mp3": "mp3",
        "audio/wav": "wav",
        "audio/x-wav": "wav",
        "audio/webm": "webm",
        "audio/ogg": "ogg",
        "audio/mp4": "mp4",
        "audio/x-m4a": "m4a",
        "audio/flac": "flac",
    };

    return byMimeType[mimeType] || "bin";
};

const runFfmpeg = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        if (!ffmpegPath) {
            reject(new Error("ffmpeg binary not found. Please install ffmpeg-static."));
            return;
        }

        const ffmpeg = spawn(
            ffmpegPath,
            [
                "-y",
                "-i",
                inputPath,
                "-ac",
                "1",
                "-ar",
                "16000",
                "-c:a",
                "pcm_s16le",
                outputPath,
            ],
            { windowsHide: true }
        );

        let stderr = "";
        ffmpeg.stderr.on("data", (chunk) => {
            stderr += chunk.toString();
        });

        ffmpeg.on("error", (error) => {
            reject(error);
        });

        ffmpeg.on("close", (code) => {
            if (code === 0) {
                resolve();
                return;
            }

            reject(new Error(`ffmpeg failed with code ${code}. ${stderr}`));
        });
    });
};

const convertBufferToWavFile = async ({ inputBuffer, originalName, mimeType }) => {
    const tempDirectory = await fsp.mkdtemp(path.join(os.tmpdir(), "stt-"));
    const extension = inferExtension(originalName, mimeType);
    const inputPath = path.join(tempDirectory, `input.${extension}`);
    const outputPath = path.join(tempDirectory, "normalized.wav");

    await fsp.writeFile(inputPath, inputBuffer);
    await runFfmpeg(inputPath, outputPath);

    return { tempDirectory, outputPath };
};

export const transcribeAudioBuffer = async ({ inputBuffer, originalName, mimeType }) => {
    const deepgramApiKey = process.env.DEEPGRAM_API_KEY;

    if (!deepgramApiKey) {
        throw new Error("Missing DEEPGRAM_API_KEY in environment variables.");
    }

    const deepgram = new DeepgramClient({ apiKey: deepgramApiKey });

    let conversion;
    try {
        conversion = await convertBufferToWavFile({
            inputBuffer,
            originalName,
            mimeType,
        });

        const audioStream = fs.createReadStream(conversion.outputPath);
        const response = await deepgram.listen.v1.media.transcribeFile(audioStream, {
            model: "nova-3",
            smart_format: true,
            language: "vi",
            punctuate: true,
            paragraphs: true,
        });

        return extractTranscript(response);
    } finally {
        if (conversion?.tempDirectory) {
            await fsp.rm(conversion.tempDirectory, { recursive: true, force: true }).catch(() => {});
        }
    }
};

export const transcribeAudioFile = async (filePath) => {
    const inputBuffer = await fsp.readFile(filePath);
    const originalName = path.basename(filePath);

    return transcribeAudioBuffer({ inputBuffer, originalName, mimeType: "audio/wav" });
};