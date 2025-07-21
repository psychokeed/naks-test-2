import express, { Router, Request, Response, NextFunction } from 'express';
import { getMpesaAccessToken, initiateStkPush } from '../services/mpesa.service';
import { initiateStkPushController } from '../controllers/mpesa.controller';

const router: Router = express.Router();

// Utility function for validation
const validateRequestBody = (phone: any, amount: any): string | null => {
    if (!phone || !amount) {
        return 'Phone and amount are required';
    }
    if (typeof phone !== 'string') {
        return 'Phone must be a string';
    }
    if (typeof amount !== 'number' || amount <= 0) {
        return 'Amount must be a positive number';
    }
    return null;
};

// GET access token (for testing only)
router.get('/token', async (_req: Request, res: Response): Promise<void> => {
    try {
        const token = await getMpesaAccessToken();
        res.json({ access_token: token });
    } catch (err) {
        console.error('Error fetching access token:', err);
        res.status(500).json({ message: 'Failed to get token' });
    }
});

// POST STK Push
router.post('/pay', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { phone, amount } = req.body;

        // Validate request body
        const validationError = validateRequestBody(phone, amount);
        if (validationError) {
            res.status(400).json({ message: validationError });
            return;
        }

        // Initiate STK Push
        const response = await initiateStkPush(phone, amount);
        res.status(200).json({ message: 'STK push initiated', response });
    } catch (err: any) {
        console.error('Error initiating STK push:', err.response?.data || err.message);
        next(err); // Pass the error to the global error handler
    }
});

// POST STK Push using controller
router.post('/stkpush', initiateStkPushController);

export default router;
 