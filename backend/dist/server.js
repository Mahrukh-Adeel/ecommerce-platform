"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/env.js");
const app_js_1 = __importDefault(require("./app.js"));
const database_js_1 = __importDefault(require("./config/database.js"));
const PORT = process.env.PORT || 5000;
(0, database_js_1.default)().then(() => {
    app_js_1.default.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
//# sourceMappingURL=server.js.map