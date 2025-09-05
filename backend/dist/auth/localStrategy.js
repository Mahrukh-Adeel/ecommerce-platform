"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const User_js_1 = __importDefault(require("../models/User.js"));
const authUtils_js_1 = require("../utils/authUtils.js");
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not defined");
}
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
};
passport_1.default.use(new passport_local_1.Strategy({ usernameField: "email", passwordField: "password" }, async (email, password, done) => {
    try {
        const user = await User_js_1.default.findOne({ email });
        if (!user) {
            return done(null, false, { message: "No account found with this email address" });
        }
        if (!user.password) {
            return done(null, false, { message: "This account uses social login. Please sign in with Google" });
        }
        const isMatch = await (0, authUtils_js_1.comparePassword)(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: "Invalid password. Please check your password and try again" });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
passport_1.default.use(new passport_jwt_1.Strategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User_js_1.default.findById(jwt_payload.sub);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    }
    catch (error) {
        return done(error, false);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_js_1.default.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
});
exports.default = passport_1.default;
//# sourceMappingURL=localStrategy.js.map