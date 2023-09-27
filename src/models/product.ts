import mongoose, { Document, Schema } from 'mongoose';

interface IProduct extends Document {
  name: string;
  description: string;
  sku: string;
  image: string;
  price: number;
  stock: number;
  tags: string[];
  priceHistory: { price: number, date: Date }[];
  stockHistory: { stock: number, date: Date }[];
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  tags: [String],
  priceHistory: [
    {
      price: Number,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  stockHistory: [
    {
      stock: Number,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.model<IProduct>('Product', productSchema);
