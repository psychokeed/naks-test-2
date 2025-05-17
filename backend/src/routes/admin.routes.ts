import express from 'express';
import { getAdminStats } from '../controllers/admin.controller';
import authMiddleware, { adminOnly } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/stats', authMiddleware, adminOnly, getAdminStats);

export default router;
