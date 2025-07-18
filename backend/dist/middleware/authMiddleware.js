"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
// src/middleware/auth.middleware.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'SachinnaNainuoo';
const authenticateToken = (req, res, next) => {
    // Use 'authorization' header (lowercase is common for HTTP headers)
    const authHeader = req.headers['authorization'];
    let token;
    // Safely extract the token string
    if (typeof authHeader === 'string') {
        token = authHeader.split(' ')[2];
    }
    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Attach the decoded user payload to the request object
        req.user = {
            id: decoded.id,
            email: decoded.email
        };
        next(); // Proceed to the next middleware or route handler
    }
    catch (err) {
        // If token is invalid or expired
        res.status(403).json({ error: 'Invalid or expired token' });
        return;
    }
};
exports.authenticateToken = authenticateToken;
