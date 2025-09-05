"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_js_1 = __importDefault(require("../models/User.js"));
const authUtils_js_1 = require("../utils/authUtils.js");
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production',
};
passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, async (payload, done) => {
    try {
        console.log('JWT Strategy - Payload received:', payload);
        const user = await User_js_1.default.findById(payload.id).select('-password');
        if (user) {
            console.log('JWT Strategy - User found:', user.email);
            return done(null, user);
        }
        else {
            console.log('JWT Strategy - User not found for id:', payload.id);
            return done(null, false, { message: 'User not found' });
        }
    }
    catch (error) {
        console.error('JWT Strategy - Error:', error);
        return done(error, false);
    }
}));
passport_1.default.use(new passport_local_1.Strategy({ usernameField: "email", passwordField: "password" }, async (email, password, done) => {
    try {
        const user = await User_js_1.default.findOne({ email });
        if (!user) {
            return done(null, false, { message: "User not found" });
        }
        if (!user.password) {
            return done(null, false, { message: "Please use OAuth login" });
        }
        const isMatch = await (0, authUtils_js_1.comparePassword)(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: "Invalid credentials" });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_js_1.default.findById(id).select('-password');
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
});
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User_js_1.default.findOne({ googleId: profile.id });
            if (user) {
                return done(null, user);
            }
            user = await User_js_1.default.findOne({ email: profile.emails?.[0]?.value });
            if (user) {
                user.googleId = profile.id;
                if (profile.photos?.[0]?.value) {
                    user.avatar = profile.photos[0].value;
                }
                user.provider = 'google';
                await user.save();
                return done(null, user);
            }
            user = await User_js_1.default.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails?.[0]?.value,
                avatar: profile.photos?.[0]?.value,
                provider: 'google',
                isVerified: true
            });
            return done(null, user);
        }
        catch (error) {
            return done(error, false);
        }
    }));
}
else {
    console.log('Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}
exports.default = passport_1.default;
//# sourceMappingURL=authStrategy.js.map