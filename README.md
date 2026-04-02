## Speech-to-Text Web App (Deepgram)

This project provides:
- A Node.js + Express backend that sends audio to Deepgram and returns transcript text.
- A login flow (single account from env) secured with JWT + Bearer authentication.
- A frontend UI where transcription controls are visible only after login:
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
CLIENT_URL=http://localhost:63342
APP_USER=your_username
APP_PASSWORD=your_password
JWT_SECRET=your_secret
```

## Run

```bash
npm start
```

API Port: `http://localhost:3000`.

## Login

- Open `login.html` from your frontend host.
- Login via `POST /api/auth/login` using `APP_USER` and `APP_PASSWORD`.
- The API returns an access token used as `Authorization: Bearer <token>` for protected routes.

## API Endpoints

- `POST /api/auth/login` (public)
- `POST /api/stt/file` (protected, Bearer token)
- `POST /api/stt/mic` (protected, Bearer token)

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
- Password verification uses BCrypt.
- Rate limiting is enabled with a 10-second window:
  - login route limit for brute-force protection,
  - STT routes limit for anti-spam protection.

## Credits
- Backend: Node.js, Express, Multer, ffmpeg
- Frontend: HTML, CSS, JavaScript (Fetch API, Web Speech API)
- [Deepgram API](https://developers.deepgram.com/reference/deepgram-api-overview) API for speech recognition 

