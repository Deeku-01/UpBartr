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

// Extend the Request type to include the 'user' property
// This allows TypeScript to understand that req.user will be available
// after this middleware runs.
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
      };
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Use 'authorization' header (lowercase is common for HTTP headers)
  const authHeader = req.headers['authorization']; 

  let token: string | undefined;

  // Safely extract the token string
  if (typeof authHeader === 'string') {
    token = authHeader.split(' ')[2];
  }


  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    // Attach the decoded user payload to the request object
    req.user = {
      id: decoded.id,
      email: decoded.email
    };
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // If token is invalid or expired
    res.status(403).json({ error: 'Invalid or expired token' });
    return;
  }
};

// Optional: Create a helper type for authenticated routes
// This is still useful for explicitly typing your route handlers
// but the declare global block above handles the req.user property.
export interface AuthenticatedRequest extends Request {
  user: { // Make 'user' non-optional here if it's guaranteed by middleware
    id: string;
    email?: string;
  };
}