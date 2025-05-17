import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import path from 'path';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import uploadRoutes from './routes/upload.routes';
import orderRoutes from './routes/order.routes';
import adminRoutes from './routes/admin.routes';
import dashboardRoutes from './routes/dashboard.routes';
import userRoutes from './routes/user.routes';
import profileRoutes from './routes/profile.routes';
import mpesaRoutes from './routes/mpesa.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔐 Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "'unsafe-inline'", 'blob:', 'data:'],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'blob:'],
        connectSrc: ["'self'", 'http://localhost:5000'],
        styleSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        fontSrc: ["'self'", 'https:', 'data:'],
      },
    },
  })
);

// 🌐 Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// 🪵 Log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});


// 📦 Route declarations
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/mpesa', mpesaRoutes);

// 📁 Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// 🌍 Health check endpoint
app.get('/', (_req, res) => {
  res.send('NAKS-Care API is running...');
});

// 🔌 Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
