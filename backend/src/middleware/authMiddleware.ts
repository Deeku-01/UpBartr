
// src/middleware/auth.middleware.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'SachinnaNainuoo';

interface JWTPayload {
  id: string;
  email?: string;
  iat?: number;
  exp?: number;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email
    };
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
    return;
  }
};

// Optional: Create a helper type for authenticated routes
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email?: string;
  };
}