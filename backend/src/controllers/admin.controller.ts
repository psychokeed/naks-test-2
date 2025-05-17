import { Request, Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';

export const getAdminStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      success: true,
      message: 'Admin stats retrieved successfully',
      data: {
        totalUsers,
        totalProducts,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin stats',
      error: (error as Error).message,
    });
  }
};
