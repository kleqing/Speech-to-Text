## Speech-to-Text Web App (Deepgram)

This project provides:
- A Node.js + Express backend that sends audio to Deepgram and returns transcript text.
- A simple frontend UI with two actions:
  - Upload an audio file.
  - Record from your microphone and transcribe in real-time (word-by-word) when browser support is available.

## Comparison with other models

Please refer to [Comparison](Comparison.md)

## Requirements

- Node.js 18+
- A Deepgram API key

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```env
DEEPGRAM_API_KEY=your_deepgram_api_key
PORT=3000
```

## Run

```bash
npm start
```

API Port: `http://localhost:3000`.

## API Endpoints

- `POST /api/stt/file` with multipart form-data field `audio`
- `POST /api/stt/mic` with multipart form-data field `audio`

Response format:

```json
{
  "transcript": "..."
}
```

## Notes

- Supported audio mime types include common formats such as mp3, wav, webm, ogg, mp4/m4a, and flac.
- Microphone mode uses browser `SpeechRecognition` for real-time updates; if unavailable, it falls back to the upload-based `/api/stt/mic` flow.
- Both `/api/stt/file` and `/api/stt/mic` receive uploaded data as in-memory buffers, normalize audio to `.wav` with ffmpeg, then send to Deepgram.

## Credits
- Backend: Node.js, Express, Multer, ffmpeg
- Frontend: HTML, CSS, JavaScript (Fetch API, Web Speech API)
- [Deepgram API](https://developers.deepgram.com/reference/deepgram-api-overview) API for speech recognition 

