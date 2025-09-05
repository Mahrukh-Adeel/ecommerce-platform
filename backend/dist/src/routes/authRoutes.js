import express from "express";
import passport from "passport";
import { getCurrentUser, registerController, refreshTokenController, logoutController } from "../controller/authController.js";
import { loginController } from "../controller/loginController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { generateTokenPair } from "../utils/jwtUtils.js";
const router = express.Router();
router.post("/signup", registerController);
router.post("/login", loginController);
router.post("/logout", requireAuth, logoutController);
router.post("/refresh-token", refreshTokenController);
router.get("/me", requireAuth, getCurrentUser);
// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
    try {
        if (!req.user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }
        const tokens = generateTokenPair(req.user);
        res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`);
    }
    catch (error) {
        console.error("OAuth callback error:", error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
});
// Session-based authentication routes (commented out for Zustand/JWT usage)
/*
router.post("/session/login",
  passport.authenticate("local", { session: true }),
  (req, res) => {
    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: (req.user as any)._id,
        email: (req.user as any).email,
        name: (req.user as any).name,
        role: (req.user as any).role
      }
    });
  }
);

router.post("/session/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed"
      });
    }
    
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Session destruction failed"
        });
      }
      
      res.clearCookie("connect.sid");
      res.json({
        success: true,
        message: "Logout successful"
      });
    });
  });
});

router.get("/session/check", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      authenticated: true,
      user: {
        id: (req.user as any)._id,
        email: (req.user as any).email,
        name: (req.user as any).name,
        role: (req.user as any).role
      }
    });
  } else {
    res.json({
      success: true,
      authenticated: false
    });
  }
});
*/
export default router;
//# sourceMappingURL=authRoutes.js.map