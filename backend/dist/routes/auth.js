"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// Register user
// @ts-ignore
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, location, bio } = req.body;
        // Check if user already exists
        const existingUser = await db.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });
        if (existingUser) {
            return res.status(400).json({
                error: existingUser.email === email ? 'Email already exists' : 'Username already exists'
            });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create new user
        const newUser = await db.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                firstName,
                lastName,
                location,
                bio: bio || '',
                rating: 0,
                totalRatings: 0,
                createdAt: new Date(),
                isVerified: false
            }
        });
        // verification Mail to be sent to user 
        // // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET || "Anything", { expiresIn: '24h' });
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: newUser
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error during registration' });
    }
});
// Login User
// @ts-ignore
router.post('/login', async (req, res) => {
    const { emailOrUsername, password } = req.body;
    try {
        // Find user
        const CurUser = await db.user.findFirst({
            where: {
                OR: [
                    { email: emailOrUsername },
                    { username: emailOrUsername }
                ]
            }
        });
        if (!CurUser) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        // Check password
        const isValidPassword = await bcryptjs_1.default.compare(password, CurUser.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: CurUser.id, email: CurUser.email }, process.env.JWT_SECRET || "Anything", { expiresIn: '24h' });
        // Set the authentication token in the response header
        res.setHeader('Authorization', `Bearer ${token}`);
        res.json({
            message: 'Login successful',
            token,
            user: CurUser //Don't send password in response
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
});
exports.default = router;
