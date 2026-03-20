import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export interface IOrder {
    customerID: Types.ObjectId,
    sellerID: Types.ObjectId,
    totalCost: number,
    paymentMethod: string,
}

export type OrderDocument = HydratedDocument<IOrder>

const orderSchema = new Schema<IOrder>(
    {
        customerID: {   
            type: Schema.Types.ObjectId,
            required: true,
        },          
        sellerID: {
            type: Schema.Types.ObjectId,
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