import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  inStock: boolean;
  imageUrl: string;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    subcategory: { type: String },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
