import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let cachedPasswordHash;

const getConfiguredCredentials = () => {
    const username = process.env.APP_USER;
    const password = process.env.APP_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!username || !password || !jwtSecret) {
        throw new Error("Missing APP_USER, APP_PASSWORD, or JWT_SECRET in environment variables.");
    }

    return { username, password, jwtSecret };
};

const getPasswordHash = async () => {
    if (!cachedPasswordHash) {
        const { password } = getConfiguredCredentials();
        cachedPasswordHash = await bcrypt.hash(password, 10);
    }

    return cachedPasswordHash;
};

export const validateCredentials = async ({ username, password }) => {
    const configured = getConfiguredCredentials();

    if (username !== configured.username) {
        return false;
    }

    const hash = await getPasswordHash();
    return bcrypt.compare(password || "", hash);
};

export const signAccessToken = (username) => {
    const { jwtSecret } = getConfiguredCredentials();

    return jwt.sign(
        {
            sub: username,
            role: "user",
        },
        jwtSecret,
        { expiresIn: "8h" }
    );
};

export const verifyAccessToken = (token) => {
    const { jwtSecret } = getConfiguredCredentials();
    return jwt.verify(token, jwtSecret);
};

