import passport from "passport";
import { generateTokenPair } from "../utils/jwtUtils.js";
export const loginController = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
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
            const tokens = generateTokenPair({
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
//# sourceMappingURL=loginController.js.map