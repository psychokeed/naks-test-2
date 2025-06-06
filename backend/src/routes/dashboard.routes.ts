import express from 'express';
import authMiddleware, { adminOnly } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/admin', authMiddleware, adminOnly, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard' });
});

router.get('/client', authMiddleware, (req, res) => {
  if (req.user?.role !== 'client') {
    res.status(403).json({ message: 'Access denied' });
    return;
  }
  res.json({ message: 'Welcome to the client dashboard' });
});

export default router;
