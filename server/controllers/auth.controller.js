import { signAccessToken, validateCredentials } from "../services/auth.service.js";

export const handleLogin = async (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
        res.status(400).json({
            error: "username and password are required.",
        });
        return;
    }

    try {
        const valid = await validateCredentials({ username, password });

        if (!valid) {
            res.status(401).json({
                error: "Invalid username or password.",
            });
            return;
        }

        const accessToken = signAccessToken(username);

        res.status(200).json({
            accessToken,
            tokenType: "Bearer",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Failed to login.",
        });
    }
};

