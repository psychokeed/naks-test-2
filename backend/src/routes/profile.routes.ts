// backend/src/routes/profile.routes.ts

import express from 'express';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/me', authMiddleware, async (req, res) => {
  res.json({
    message: 'You are authorized',
    user: req.user,
  });
});

export default router;
