import { Request, Response, NextFunction } from 'express';

const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Access denied. Admins only.' });
    return;
  }
  return next();
};

export default adminMiddleware;
