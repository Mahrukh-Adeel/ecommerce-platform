"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = void 0;
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
async function hashPassword(password) {
    return bcrypt_1.default.hash(password, 10);
}
async function comparePassword(password, hash) {
    return bcrypt_1.default.compare(password, hash);
}
const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, message: 'Password is required' };
    }
    if (password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters long' };
    }
    if (password.length > 128) {
        return { isValid: false, message: 'Password must be less than 128 characters' };
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!hasLetter || !hasNumber) {
        return { isValid: false, message: 'Password must contain at least one letter and one number' };
    }
    return { isValid: true };
};
exports.validatePassword = validatePassword;
//# sourceMappingURL=authUtils.js.map