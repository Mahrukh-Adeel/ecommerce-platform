import User from '../models/User.js';
import bcrypt from 'bcrypt';
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
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
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
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
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, phone, address, ...otherFields } = req.body;
        const user = await User.findById(id);
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
            const existingUser = await User.findOne({ email, _id: { $ne: id } });
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
            updateData.password = await bcrypt.hash(password, saltRounds);
        }
        if (phone)
            updateData.phone = phone;
        if (address)
            updateData.address = address;
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
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
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
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
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required"
            });
            return;
        }
        const user = await User.findById(userId)
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
export const updateUserRole = async (req, res) => {
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
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true }).select('-password');
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
//# sourceMappingURL=userController.js.map