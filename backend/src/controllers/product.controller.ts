import { Request, Response } from 'express';
import Product from '../models/Product';

// Create a new product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err: any) {
    console.error('Create Product Error:', err);
    res.status(400).json({
      message: 'Error creating product',
      error: err.errors || err.message || err,
    });
  }
};

// Get all products
export const getAllProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err });
  }
};

// Get single product by ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Invalid product ID', error: err });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json(product);
  } catch (err: any) {
    res.status(400).json({
      message: 'Error updating product',
      error: err.errors || err.message || err,
    });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid product ID', error: err });
  }
};
