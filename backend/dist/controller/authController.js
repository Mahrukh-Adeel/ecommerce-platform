"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = exports.getCurrentUser = exports.refreshTokenController = exports.registerController = void 0;
const User_js_1 = __importDefault(require("../models/User.js"));
const authUtils_js_1 = require("../utils/authUtils.js");
const jwtUtils_js_1 = require("../utils/jwtUtils.js");
const registerController = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
            return;
        }
        const existingUser = await User_js_1.default.findOne({ email });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
            return;
        }
        const hashedPassword = await (0, authUtils_js_1.hashPassword)(password);
        const newUser = new User_js_1.default({
            name,
            email,
            password: hashedPassword,
            role: role === 'admin' ? 'admin' : 'user'
        });
        const savedUser = await newUser.save();
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: savedUser._id.toString(),
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role
            }
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during registration",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.registerController = registerController;
const refreshTokenController = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({
                success: false,
                message: "Refresh token is required"
            });
            return;
        }
        const payload = (0, jwtUtils_js_1.verifyRefreshToken)(refreshToken);
        const user = await User_js_1.default.findById(payload.id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        const newAccessToken = (0, jwtUtils_js_1.generateAccessToken)({
            id: (user._id).toString(),
            email: user.email,
            role: user.role || 'user'
        });
        res.json({
            success: true,
            message: "Token refreshed successfully",
            accessToken: newAccessToken
        });
    }
    catch (error) {
        console.error("Token refresh error:", error);
        res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.refreshTokenController = refreshTokenController;
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }
        const user = req.user;
        res.json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    }
    catch (error) {
        console.error("Get current user error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching user data",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.getCurrentUser = getCurrentUser;
const logoutController = async (req, res) => {
    try {
        res.json({
            success: true,
            message: "Logged out successfully"
        });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "Error during logout",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.logoutController = logoutController;
//# sourceMappingURL=authController.js.map