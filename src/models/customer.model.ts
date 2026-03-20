import { Schema, model, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  address: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
}, { timestamps: true });

export const Customer = model<ICustomer>('Customer', customerSchema);