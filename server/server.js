import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import sttRoutes from "./routes/sttRoute.js";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.resolve(__dirname, "../client");
const normalizeOrigin = (value = "") => value.replace(/\/+$/, "");
const allowedOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((item) => normalizeOrigin(item.trim()))
    .filter(Boolean);


app.use(
    cors({
        origin(origin, callback) {
            // allow non-browser tools (curl/postman) that have no Origin header
            if (!origin) return callback(null, true);

            const normalized = normalizeOrigin(origin);
            if (allowedOrigins.length === 0 || allowedOrigins.includes(normalized)) {
                return callback(null, true);
            }

            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(clientPath));

app.get("/health", (_req, res) => {
    res.json({ ok: true });
});

app.use("/api", sttRoutes);

app.use((error, _req, res, _next) => {
    if (error) {
        res.status(400).json({
            error: error.message || "Request failed.",
        });
        return;
    }

    res.status(500).json({
        error: "Internal server error.",
    });
});

export { app };

export const startServer = (listenPort = port) => {
    return app.listen(listenPort, () => {
        console.log(`Server running at http://localhost:${listenPort}`);
    });
};

const runningDirectly = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (runningDirectly) {
    startServer();
}
