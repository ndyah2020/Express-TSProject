import { Types } from 'mongoose';
import { IOrder, OrderDocument } from '../models/order.model';
import { OrderRes } from '../interfaces/order.interface';

type orderInput = OrderDocument | (IOrder & {_id: Types.ObjectId})

export const toOrderRes = (doc: orderInput): OrderRes => {
    return {
        id: doc._id.toString(),
        customerID: doc.customerID.toString(),
        sellerID: doc.sellerID.toString(),
        totalCost: doc.totalCost,
        paymentMethod: doc.paymentMethod,
    }
}