import express, { Request, Response } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import User from '../models/User';

const router = express.Router();

router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      message: 'Authenticated user retrieved successfully',
      user,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});


export default router;
