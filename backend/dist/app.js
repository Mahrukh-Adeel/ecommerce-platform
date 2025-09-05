"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const passport_1 = __importDefault(require("passport"));
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const categoryRoutes_js_1 = __importDefault(require("./routes/categoryRoutes.js"));
const productRoutes_js_1 = __importDefault(require("./routes/productRoutes.js"));
const orderRoutes_js_1 = __importDefault(require("./routes/orderRoutes.js"));
const userRoutes_js_1 = __importDefault(require("./routes/userRoutes.js"));
const cartRoutes_js_1 = __importDefault(require("./routes/cartRoutes.js"));
const wishlistRoutes_js_1 = __importDefault(require("./routes/wishlistRoutes.js"));
require("./auth/authStrategy.js");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://everwood.netlify.app"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
}));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || (() => { throw new Error("SESSION_SECRET is not defined"); })(),
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 24 * 60 * 60 // 24 hours
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    next();
});
app.get("/", (req, res) => {
    res.send("API is running...");
});
app.use("/api/auth", authRoutes_js_1.default);
app.use("/api/categories", categoryRoutes_js_1.default);
app.use("/api/products", productRoutes_js_1.default);
app.use("/api/orders", orderRoutes_js_1.default);
app.use("/api/users", userRoutes_js_1.default);
app.use("/api/cart", cartRoutes_js_1.default);
app.use("/api/wishlist", wishlistRoutes_js_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map