import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export interface IOrderDetail {
    orderID: Types.ObjectId,
    productID: Types.ObjectId,
    quantity: number,
    price: number,
    totalPrice: number,
}

export type OrderDetailDocument = HydratedDocument<IOrderDetail>

const orderDetailSchema = new Schema<IOrderDetail>(
    {
        orderID: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        productID: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)
export default mongoose.model<IOrderDetail>('OrderDetail', orderDetailSchema)