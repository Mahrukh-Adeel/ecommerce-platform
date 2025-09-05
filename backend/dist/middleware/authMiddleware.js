"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSelfOrAdmin = exports.requireAdmin = exports.optionalAuth = exports.requireAnyAuth = exports.requireSessionAuth = exports.requireAuth = void 0;
const passport_1 = __importDefault(require("passport"));
const requireAuth = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
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
                message: 'Unauthorized - Invalid or expired token',
                error: info?.message || 'No valid token provided'
            });
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.requireAuth = requireAuth;
const requireSessionAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({
        success: false,
        message: 'Please log in to access this resource'
    });
};
exports.requireSessionAuth = requireSessionAuth;
const requireAnyAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    (0, exports.requireAuth)(req, res, next);
};
exports.requireAnyAuth = requireAnyAuth;
const optionalAuth = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (err, user) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Authentication error',
                error: err.message
            });
        }
        if (user) {
            req.user = user;
        }
        next();
    })(req, res, next);
};
exports.optionalAuth = optionalAuth;
const requireAdmin = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
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
                message: 'Unauthorized - Invalid or expired token',
                error: info?.message || 'No valid token provided'
            });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden - Admin access required'
            });
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.requireAdmin = requireAdmin;
const requireSelfOrAdmin = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
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
                message: 'Unauthorized - Invalid or expired token',
                error: info?.message || 'No valid token provided'
            });
        }
        const userId = req.params.userId || req.params.id;
        const isOwner = user._id.toString() === userId;
        console.log('Auth Check:', {
            userIdFromParams: userId,
            userIdFromToken: user._id.toString(),
            isOwner,
            isAdmin: user.role === 'admin',
            userRole: user.role
        });
        if (!isOwner && user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden - You can only access your own data or be an admin'
            });
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.requireSelfOrAdmin = requireSelfOrAdmin;
//# sourceMappingURL=authMiddleware.js.map