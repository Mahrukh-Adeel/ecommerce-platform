"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = void 0;
const passport_1 = __importDefault(require("passport"));
const jwtUtils_js_1 = require("../utils/jwtUtils.js");
const loginController = (req, res, next) => {
    passport_1.default.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Authentication error',
                error: err.message
            });
        }
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
                error: info?.message || 'Authentication failed'
            });
        }
        try {
            const tokens = (0, jwtUtils_js_1.generateTokenPair)({
                _id: user._id.toString(),
                email: user.email,
                role: user.role
            });
            res.json({
                success: true,
                message: 'Login successful',
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                tokens
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Token generation failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    })(req, res, next);
};
exports.loginController = loginController;
//# sourceMappingURL=loginController.js.map