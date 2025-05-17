import { Request, Response, NextFunction } from 'express';
import { initiateStkPush } from '../services/mpesa.service';

// Controller for initiating STK Push
export const initiateStkPushController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { phone, amount } = req.body;

        // Validate request body
        if (!phone || !amount) {
            res.status(400).json({ message: 'Phone and amount are required' });
            return;
        }
        if (typeof phone !== 'string') {
            res.status(400).json({ message: 'Phone must be a string' });
            return;
        }
        if (typeof amount !== 'number' || amount <= 0) {
            res.status(400).json({ message: 'Amount must be a positive number' });
            return;
        }

        // Initiate STK Push
        const response = await initiateStkPush(phone, amount);
        res.status(200).json({ message: 'STK push initiated', response });
    } catch (err: any) {
        console.error('Error in initiateStkPushController:', err.response?.data || err.message);
        next(err); // Pass the error to the global error handler
    }
};