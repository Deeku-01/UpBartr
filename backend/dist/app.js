"use strict";
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
const exchange_1 = __importDefault(require("./routes/exchange"));
const skillrequests_1 = __importDefault(require("./routes/skillrequests"));
// // Import middleware
// import { errorHandler } from './middleware/error.middleware';
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Security middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true
// }));
app.use((0, cors_1.default)());
// Routes
app.use('/api/skillreqs', skillrequests_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/users', user_1.default);
app.use('/api/skills', application_1.default);
app.use('/api/exchanges', exchange_1.default);
// // Error handling
// app.use(errorHandler);
// 404 handler
app.use('/', (req, res) => {
    res.status(200).json({ message: 'Welcome !!' });
});
exports.default = app;
