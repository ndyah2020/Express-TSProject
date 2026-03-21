
import { Types } from 'mongoose';
import { CustomerRes } from "../interfaces/customers.interface";

type CustomerInput = {
  _id: Types.ObjectId | string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

export const toCustomerRes = (doc: CustomerInput): CustomerRes => {
  return {
    id: typeof doc._id === 'string' ? doc._id : doc._id.toString(),
    name: doc.name || '',
    email: doc.email || '',
    phone: doc.phone || '',
    address: doc.address || '',
    createdAt: doc.createdAt || new Date(),
    updatedAt: doc.updatedAt || new Date(),
  };
};