import mongoose, { Schema , Document}  from "mongoose"; 
import { Icustomer } from "../interfaces/customers.interface";

export interface IcustomerDocument extends Icustomer, Document {}

const customerSchema = new Schema<IcustomerDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
}, {
    timestamps: true
})
export const Customer =mongoose.model<IcustomerDocument>('Customer', customerSchema);
