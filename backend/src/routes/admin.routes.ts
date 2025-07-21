// src/routes/admin.routes.ts
import express from 'express';
import {
  getAdminStats,
} from '../controllers/admin.controller';

import {
  getAllOrders,
  updateOrderStatus,
  getSingleOrder,
  
} from '../controllers/order.controller';

import authMiddleware, { adminOnly } from '../middlewares/auth.middleware';
import { getMonthlyStats } from '../controllers/admin.controller';
// src/routes/admin.routes.ts
import { getTopProducts } from '../controllers/admin.controller';
import { getRevenueTrends } from '../controllers/analytics.controller';
import { getSalesTrends } from '../controllers/admin.controller';




const router = express.Router();

// 📊 Admin Dashboard Stats
router.get('/stats', authMiddleware, adminOnly, getAdminStats);

// 📦 Orders Management (Admin Only)
router.get('/orders', authMiddleware, adminOnly, getAllOrders);
router.put('/orders/:id/status', authMiddleware, adminOnly, updateOrderStatus);
router.get('/orders/:id', authMiddleware, adminOnly, getSingleOrder);
router.get('/stats/monthly', authMiddleware, adminOnly, getMonthlyStats);
router.get('/stats/top-products', authMiddleware, adminOnly, getTopProducts);
router.get('/analytics/top-products', authMiddleware, adminOnly, getTopProducts);
// 📊 Revenue Trends (Daily/Weekly/Monthly)
router.get('/analytics/revenue-trends', authMiddleware, adminOnly, getRevenueTrends);
router.get('/sales-trends', authMiddleware, adminOnly, getSalesTrends);



export default router;
