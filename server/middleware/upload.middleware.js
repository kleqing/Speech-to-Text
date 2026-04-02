import multer from "multer";

const allowedMimeTypes = new Set([
	"audio/mpeg",
	"audio/wav",
	"audio/x-wav",
	"audio/mp3",
	"audio/webm",
	"audio/ogg",
	"audio/mp4",
	"audio/x-m4a",
	"audio/flac",
]);

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 25 * 1024 * 1024,
	},
	fileFilter: (_req, file, cb) => {
		if (!allowedMimeTypes.has(file.mimetype)) {
			cb(new Error("Unsupported audio format."));
			return;
		}
		cb(null, true);
	},
});

export default upload;