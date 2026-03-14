import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
    customerID: number,
    sellerID: number,
    totalCost: number,
    paymentMethod: string,
}

const orderSchema = new Schema<IOrder>(
    {
        customerID: {   
            type: Number,
            required: true,
        },          
        sellerID: {
            type: Number,
            required: true,
        },
        totalCost: {    
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
        },  
    },  
    {
        timestamps: true,
    }
)

export default mongoose.model<IOrder>('Order', orderSchema)