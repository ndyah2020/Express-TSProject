// src/interfaces/customers.interface.ts
export interface CustomerRes {
  id: string;  // từ _id
  name: string;
  email: string;
  address: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}