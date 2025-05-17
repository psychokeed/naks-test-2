import express from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import adminMiddleware from '../middlewares/admin.middleware';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

router.get('/test', (_req, res) => {
    res.send('Product route is working');
  });
  

export default router;
