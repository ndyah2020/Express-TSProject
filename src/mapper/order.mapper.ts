import { Types } from 'mongoose';
import { IOrder, OrderDocument } from '../models/order.model';
import { OrderRes, OrderRes2, OrtherDocument } from '../interfaces/order.interface';

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


export const toOrderDetailRes = (doc: OrtherDocument): OrderRes2 => {
    return {
        id: doc._id.toString(),
        customerID: doc.customerID,
        sellerID: doc.sellerID,
        totalCost: doc.totalCost,
        paymentMethod: doc.paymentMethod,
        createdAt: doc.createdAt,
        details: doc.details.map(detail => ({
            id: detail._id.toString(),
            quantity: detail.quantity,
            price: detail.price,
            totalPrice: detail.totalPrice,
            productID: {
                id: detail.productID._id.toString(),
                product_name: detail.productID.product_name,
                price: detail.productID.price,
                quantity: detail.productID.quantity,
                inventory_quantity: detail.productID.inventory_quantity,
                supplier: detail.productID.supplier,
                categoryId: detail.productID.categoryId,
            }
        }))
    }
}