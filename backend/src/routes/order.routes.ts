import express from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/order.controller';
import authMiddleware, { adminOnly } from '../middlewares/auth.middleware';

const router = express.Router();

// 🔐 Authenticated users can create an order or view their own orders
router.post('/', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getUserOrders);

// 🔒 Admin-only routes for managing all orders
router.get('/', authMiddleware, adminOnly, getAllOrders);
router.put('/:id/status', authMiddleware, adminOnly, updateOrderStatus);

export default router;
