"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const authController_js_1 = require("../controller/authController.js");
const loginController_js_1 = require("../controller/loginController.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const jwtUtils_js_1 = require("../utils/jwtUtils.js");
const router = express_1.default.Router();
router.post("/signup", authController_js_1.registerController);
router.post("/login", loginController_js_1.loginController);
router.post("/logout", authMiddleware_js_1.requireAuth, authController_js_1.logoutController);
router.post("/refresh-token", authController_js_1.refreshTokenController);
router.get("/me", authMiddleware_js_1.requireAuth, authController_js_1.getCurrentUser);
// Google OAuth routes
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", { session: false }), (req, res) => {
    try {
        if (!req.user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }
        const tokens = (0, jwtUtils_js_1.generateTokenPair)(req.user);
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
exports.default = router;
//# sourceMappingURL=authRoutes.js.map