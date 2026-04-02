import { verifyAccessToken } from "../services/auth.service.js";

export const requireAuth = (req, res, next) => {
    const authorization = req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
        res.status(401).json({
            error: "Missing or invalid Authorization header.",
        });
        return;
    }

    const token = authorization.slice(7).trim();

    try {
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
    } catch (_error) {
        res.status(401).json({
            error: "Invalid or expired token.",
        });
    }
};

