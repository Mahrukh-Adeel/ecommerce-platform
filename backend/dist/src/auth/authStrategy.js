import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import { comparePassword } from "../utils/authUtils.js";
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production',
};
passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        console.log('JWT Strategy - Payload received:', payload);
        const user = await User.findById(payload.id).select('-password');
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
passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password" }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: "User not found" });
        }
        if (!user.password) {
            return done(null, false, { message: "Please use OAuth login" });
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: "Invalid credentials" });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select('-password');
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
});
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
                return done(null, user);
            }
            user = await User.findOne({ email: profile.emails?.[0]?.value });
            if (user) {
                user.googleId = profile.id;
                if (profile.photos?.[0]?.value) {
                    user.avatar = profile.photos[0].value;
                }
                user.provider = 'google';
                await user.save();
                return done(null, user);
            }
            user = await User.create({
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
export default passport;
//# sourceMappingURL=authStrategy.js.map