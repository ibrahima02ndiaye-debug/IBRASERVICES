import { Request as ExpressRequest, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends ExpressRequest {
  user?: { id: string; role: string };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // FIX: Access header via req.headers property as .header() method might be missing in type definition
  const authHeader = (req as ExpressRequest).headers['authorization'];

  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token required.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string; iat: number; exp: number };
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};