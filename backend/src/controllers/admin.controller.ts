// src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';


// 📊 Admin Dashboard Stats
export const getAdminStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const totalRevenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = totalRevenueData[0]?.total || 0;

    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      ordersByStatus,
      message: 'Admin stats retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch admin stats',
      error: (error as Error).message,
    });
  }
};


export const getMonthlyStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({ stats });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch monthly stats", error });
  }
};

// Top-selling products
export const getTopProducts = async (_req: Request, res: Response) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.product',
          totalSold: { $sum: '$products.quantity' },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: '$productInfo' },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          name: '$productInfo.name',
          totalSold: 1,
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({ topProducts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get top products', error: (err as Error).message });
  }
};

// 📈 Sales Trends: Daily, Weekly, Monthly
export const getSalesTrends = async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();

    // Daily: last 7 days
    const daily = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Weekly: last 8 weeks
    const weekly = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getTime() - 56 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: { $isoWeek: '$createdAt' },
          totalSales: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Monthly: last 6 months
    const monthly = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ daily, weekly, monthly });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sales trends', error: (error as Error).message });
  }
};

