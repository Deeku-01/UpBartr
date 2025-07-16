"use strict";
// app.ts (your main Express app file)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const application_1 = __importDefault(require("./routes/application"));
const skillrequests_1 = __importDefault(require("./routes/skillrequests"));
const conversations_1 = __importDefault(require("./routes/conversations")); // NEW: Import conversation routes
const messages_1 = __importDefault(require("./routes/messages"));
// Import middleware
const authMiddleware_1 = require("./middleware/authMiddleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Routes
app.use('/api/skillreqs', skillrequests_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/users', user_1.default);
app.use('/api/skills', application_1.default); // Applications routes
app.use('/api/messages', messages_1.default);
app.use('/api/conversations', authMiddleware_1.authenticateToken, conversations_1.default); // NEW: Register conversation routes
// Note: `authenticateToken` is applied here so all conversation routes are protected.
// 404 handler
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome !!' });
});
exports.default = app;
