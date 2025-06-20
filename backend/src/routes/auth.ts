import { Router } from 'express';
import zod from 'zod'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken'
import { Request } from 'express';

const db = new PrismaClient();
const router = Router();

//req res 
interface AuthenticatedRequest extends Request {
  user?: { id: string; email?: string };
}
// Register user
// @ts-ignore
router.post('/register', async (req, res) => {
  try {
    const { username,email, password, firstName, lastName, location } = req.body;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
        where:{
            OR: [
          { email },
          { username }
        ]
    }   
    });
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email ? 'Email already exists' : 'Username already exists' 
      });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await db.user.create({
        data:{
            email,
            password: hashedPassword,
            firstName,
            lastName,
            location,
            bio: '',
            rating: 0,
            totalReviews: 0,
            skillsOffered: [],
            skillsWanted: [],
            createdAt: new Date(),
            isVerified: false
        }
    })

    // // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || "Anything",
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login User
// @ts-ignore
router.post('login', async (req, res) => {
     const { emailOrUsername, password} = req.body;

    try {
   
    // Find user
    const CurUser = await db.user.findFirst({
        where:{
            OR: [
          { email:emailOrUsername },
          { username:emailOrUsername }
        ]
    }   
    })
    if (!CurUser) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, CurUser.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: CurUser.id, email: CurUser.email },
      process.env.JWT_SECRET || "Anything",
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: CurUser
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});
export default router;