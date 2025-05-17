import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  role: 'client' | 'admin';
}

// 👇 Augment Express Request type to include authenticated user
declare global {
  namespace Express {
      interface Request {
      user?: JwtPayload;
    }
  }
}

// 🔐 General authentication middleware
const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return;
  }
};

// 🔒 Middleware to restrict access to admins only
export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Forbidden: Admins only' });
    return;
  }
  next();
};

export default authMiddleware;
