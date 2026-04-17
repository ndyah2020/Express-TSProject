import mongoose, { Schema, Document, HydratedDocument } from "mongoose";
export interface IProduct extends Document {
  product_name: string;
  price: number;
  quantity: number;
  inventory_quantity: number;
  categoryId: mongoose.Types.ObjectId;
  supplier: string;
  createdAt: Date,
  updatedAt: Date,
}

export interface IProduct2 {
  product_name: string;
  price: number;
  quantity: number;
  inventory_quantity: number;
  categoryId: mongoose.Types.ObjectId;
  supplier: string;
  createdAt: Date,
  updatedAt: Date,
}

export type ProductDocument = HydratedDocument<IProduct2>

const productSchema = new Schema<IProduct2>(
  {
    product_name: {
      required: true,
      type: String,
    },
    price: {
      required: true,
      type: Number,
    },
    quantity: {
      required: true,
      type: Number,
    },
    inventory_quantity: {
      required: true,
      type: Number,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    supplier: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.model<IProduct2>("Product", productSchema);
