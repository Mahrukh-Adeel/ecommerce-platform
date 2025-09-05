"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.getUserProfile = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const User_js_1 = __importDefault(require("../models/User.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const getAllUsers = async (req, res) => {
    try {
        const users = await User_js_1.default.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json({
            success: true,
            data: users,
            message: "Users retrieved successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error
        });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_js_1.default.findById(id)
            .select('-password')
            .lean();
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: user,
            message: "User retrieved successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching user",
            error
        });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, phone, address, ...otherFields } = req.body;
        const user = await User_js_1.default.findById(id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        const updateData = { ...otherFields };
        if (name)
            updateData.name = name;
        if (email) {
            const existingUser = await User_js_1.default.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    message: "Email is already taken"
                });
                return;
            }
            updateData.email = email;
        }
        if (password) {
            const saltRounds = 10;
            updateData.password = await bcrypt_1.default.hash(password, saltRounds);
        }
        if (phone)
            updateData.phone = phone;
        if (address)
            updateData.address = address;
        const updatedUser = await User_js_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
        res.status(200).json({
            success: true,
            data: updatedUser,
            message: "User updated successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating user",
            error
        });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_js_1.default.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error
        });
    }
};
exports.deleteUser = deleteUser;
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required"
            });
            return;
        }
        const user = await User_js_1.default.findById(userId)
            .select('-password')
            .lean();
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: user,
            message: "Profile retrieved successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching profile",
            error
        });
    }
};
exports.getUserProfile = getUserProfile;
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (!role || !['user', 'admin'].includes(role)) {
            res.status(400).json({
                success: false,
                message: "Valid role is required (user or admin)"
            });
            return;
        }
        const user = await User_js_1.default.findById(id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        const updatedUser = await User_js_1.default.findByIdAndUpdate(id, { role }, { new: true, runValidators: true }).select('-password');
        res.status(200).json({
            success: true,
            data: updatedUser,
            message: `User role updated to ${role} successfully`
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating user role",
            error
        });
    }
};
exports.updateUserRole = updateUserRole;
//# sourceMappingURL=userController.js.map