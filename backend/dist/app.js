"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// // Import routes
// import authRoutes from './routes/auth.routes';
// import userRoutes from './routes/user.routes';
// import skillsRoutes from './routes/skills.routes';
// import exchangeRoutes from './routes/exchange.routes';
// // Import middleware
// import { errorHandler } from './middleware/error.middleware';
const app = (0, express_1.default)();
// Security middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
// Health check
// app.get('/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });
// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/skills', skillsRoutes);
// app.use('/api/exchanges', exchangeRoutes);
// // Error handling
// app.use(errorHandler);
// 404 handler
app.use('/', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
exports.default = app;
