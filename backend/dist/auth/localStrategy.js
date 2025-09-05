import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User.js";
import { comparePassword } from "../utils/authUtils.js";
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not defined");
}
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
};
passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password" }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: "No account found with this email address" });
        }
        if (!user.password) {
            return done(null, false, { message: "This account uses social login. Please sign in with Google" });
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: "Invalid password. Please check your password and try again" });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.sub);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    }
    catch (error) {
        return done(error, false);
    }
}));
passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
});
export default passport;
//# sourceMappingURL=localStrategy.js.map