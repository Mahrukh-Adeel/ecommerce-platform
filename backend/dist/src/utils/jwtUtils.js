import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || '23562728';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '7829210101';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'; // Changed from 15m to 24h
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d'; // Changed from 7d to 30d
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
};
export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw new Error('Invalid or expired access token');
    }
};
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET);
    }
    catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};
export const generateTokenPair = (user) => {
    const payload = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    return {
        accessToken,
        refreshToken,
        expiresIn: JWT_EXPIRES_IN,
    };
};
export const extractTokenFromHeader = (authHeader) => {
    if (!authHeader)
        return null;
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }
    return parts[1] || null;
};
export const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    }
    catch (error) {
        return null;
    }
};
//# sourceMappingURL=jwtUtils.js.map