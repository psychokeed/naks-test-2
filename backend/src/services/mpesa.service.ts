import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Validates required environment variables
 */
const validateEnvVariables = (): void => {
    const requiredVars = ['MPESA_CONSUMER_KEY', 'MPESA_CONSUMER_SECRET', 'MPESA_SHORTCODE', 'MPESA_CALLBACK_URL'];
    const missingVars = requiredVars.filter((key) => !process.env[key]);
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
};

validateEnvVariables();

/**
 * Fetch M-PESA access token using consumer credentials
 */
export const getMpesaAccessToken = async (): Promise<string> => {
  try {
      console.log('Requesting Access Token with:', {
          username: process.env.MPESA_CONSUMER_KEY,
          password: process.env.MPESA_CONSUMER_SECRET,
      });

      const response = await axios.post(
          'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
          {},
          {
              auth: {
                  username: process.env.MPESA_CONSUMER_KEY || '',
                  password: process.env.MPESA_CONSUMER_SECRET || '',
              },
          }
      );

      console.log('Access Token Response:', response.data); // Log the full response
      if (!response.data.access_token) {
          throw new Error('Access token is missing from the response');
      }
      return response.data.access_token;
  } catch (err: any) {
      console.error('Error fetching access token:', err.response?.data || err.message);
      throw new Error('Failed to retrieve access token');
  }
};

/**
 * Generates the password for the STK Push request
 */
const generatePassword = (): string => {
    const shortcode = process.env.MPESA_SHORTCODE || '';
    const passkey = process.env.MPESA_PASSKEY || '';
    const timestamp = getCurrentTimestamp();
    return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
};

/**
 * Gets the current timestamp in the required format (YYYYMMDDHHMMSS)
 */
const getCurrentTimestamp = (): string => {
    const now = new Date();
    return `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now
        .getDate()
        .toString()
        .padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
};

/**
 * Initiates an M-PESA STK Push request
 */
export const initiateStkPush = async (phone: string, amount: number): Promise<any> => {
    try {
        const token = await getMpesaAccessToken();
        console.log('Using Access Token:', token); // Log the token being used

        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: process.env.MPESA_SHORTCODE,
                Password: generatePassword(),
                Timestamp: getCurrentTimestamp(),
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phone,
                PartyB: process.env.MPESA_SHORTCODE,
                PhoneNumber: phone,
                CallBackURL: process.env.MPESA_CALLBACK_URL,
                AccountReference: 'Test',
                TransactionDesc: 'Payment',
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
      } catch (error: any) {
        console.error(
          '❌ Error initiating STK Push:',
          error?.response?.data || error?.message || error
        );
        throw new Error(
          `Failed to initiate STK Push: ${JSON.stringify(error?.response?.data || error?.message || error)}`
        );
      }
      
};