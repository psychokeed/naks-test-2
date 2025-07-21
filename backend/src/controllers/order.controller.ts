import { Request, Response } from 'express';
import Order from '../models/Order';
import User from '../models/User';
import sendEmail from '../utils/sendEmail';
import { JwtPayload } from '../types/jwtPayload';

interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: 'client' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

function assertUser(req: Request): asserts req is Request & { user: CustomJwtPayload } {
  if (!req.user || !req.user.id) {
    throw new Error('User not authenticated');
  }
}

// ✅ Create Order with validation & email notification
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    assertUser(req);
    const { products, totalAmount } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      res.status(400).json({ message: 'Invalid or missing products array' });
      return;
    }

    if (!totalAmount || typeof totalAmount !== 'number') {
      res.status(400).json({ message: 'Invalid or missing totalAmount' });
      return;
    }

    const order = new Order({
      user: req.user.id,
      products,
      totalAmount,
    });

    const savedOrder = await order.save();

    // ✅ Send confirmation email
    const user = await User.findById(req.user.id);
    if (user?.email) {
      const htmlMessage = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Hi ${user.name},</h2>
          <p>Thank you for your order! 🎉</p>
          <p><strong>Order ID:</strong> ${savedOrder._id}</p>
          <p>We’ll notify you once it’s processed and on its way.</p>
          <hr />
          <p style="color: #888;">– The NAKS-Care Team</p>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject: 'Order Confirmation - NAKS-Care',
        text: `Hi ${user.name},\n\nThank you for your order! Your order ID is ${savedOrder._id}.`,
        html: htmlMessage,
      });
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder,
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({
      message: 'Error creating order',
      error: err instanceof Error ? err.message : err,
    });
  }
};

// ✅ Get Orders for Logged-in User
export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    assertUser(req);
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err });
  }
};

// ✅ Get All Orders (Admin)
export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all orders', error: err });
  }
};

// ✅ Get a single order by ID (Admin)
export const getSingleOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('user', 'name email');
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch order',
      error: err instanceof Error ? err.message : err,
    });
  }
};


// ✅ Update Order Status (Admin)
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || typeof status !== 'string') {
      res.status(400).json({ message: 'Invalid status value' });
      return;
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      res.status(400).json({ message: 'Invalid status value' });
      return;
    }

    order.status = status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    const updatedOrder = await order.save();

    res.status(200).json({
      message: 'Order status updated successfully',
      order: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status', error: err });
  }
};

