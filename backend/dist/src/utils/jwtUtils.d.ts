import type { Types } from 'mongoose';
export interface JWTPayload {
    id: string;
    email: string;
    role: 'user' | 'admin';
    iat?: number;
    exp?: number;
}
export declare const generateAccessToken: (payload: Omit<JWTPayload, "iat" | "exp">) => string;
export declare const generateRefreshToken: (payload: Omit<JWTPayload, "iat" | "exp">) => string;
export declare const verifyAccessToken: (token: string) => JWTPayload;
export declare const verifyRefreshToken: (token: string) => JWTPayload;
export declare const generateTokenPair: (user: {
    _id: string | Types.ObjectId;
    email: string;
    role: "user" | "admin";
}) => {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
};
export declare const extractTokenFromHeader: (authHeader: string | undefined) => string | null;
export declare const decodeToken: (token: string) => JWTPayload | null;
//# sourceMappingURL=jwtUtils.d.ts.map