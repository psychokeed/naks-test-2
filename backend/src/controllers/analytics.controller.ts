import { Request, Response } from 'express';
import Order from '../models/Order';

// 📈 Revenue Trends (daily, weekly, monthly)
export const getRevenueTrends = async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();

    // Get today's date at midnight
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // 7 days ago at midnight
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);

    // 30 days ago at midnight
    const monthAgo = new Date(today);
    monthAgo.setDate(today.getDate() - 29);

    const trends = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: monthAgo },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$createdAt' },
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          totalRevenue: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
      },
    ]);

    res.status(200).json({
      message: 'Revenue trend data fetched successfully',
      trends,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch revenue trend data',
      error: (error as Error).message,
    });
  }
};
