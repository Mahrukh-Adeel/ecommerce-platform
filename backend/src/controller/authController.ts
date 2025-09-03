import type { Request, Response } from "express";
import User from "../models/User.js";
import { hashPassword } from "../utils/authUtils.js";
import { verifyRefreshToken, generateAccessToken } from "../utils/jwtUtils.js";

export const registerController = async (req: Request, res: Response): Promise<void> => {
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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ 
        success: false,
        message: "User with this email already exists" 
      });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
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
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error during registration",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const refreshTokenController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: "Refresh token is required"
      });
      return;
    }

    const payload = verifyRefreshToken(refreshToken);
    
    const user = await User.findById(payload.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
      return;
    }

    const newAccessToken = generateAccessToken({
      id: (user._id).toString(),
      email: user.email,
      role: user.role || 'user'
    });

    res.json({
      success: true,
      message: "Token refreshed successfully",
      accessToken: newAccessToken
    });

  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
      return;
    }

    const user = req.user as any;
    
    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user data",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const logoutController = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Error during logout",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};