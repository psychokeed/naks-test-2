import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  products: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount must be a positive number'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default mongoose.model<IOrder>('Order', orderSchema);
