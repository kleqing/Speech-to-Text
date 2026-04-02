import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
	windowMs: 10 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		error: "Too many login attempts. Please wait 10 seconds.",
	},
});

export const sttLimiter = rateLimit({
	windowMs: 10 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		error: "Too many requests. Please wait 10 seconds.",
	},
});

