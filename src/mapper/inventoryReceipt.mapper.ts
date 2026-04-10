import { Types } from "mongoose";
import { IInventoryReceipt, IInventoryReceiptDocument } from "../models/InventoryReceipt.model";
import { IInventoryReceiptRes, InventoryReceiptDetailRes, InventoryReceiptRes } from "../interfaces/inventoryReceipt";

type InventoryReceiptInput = IInventoryReceiptDocument | (IInventoryReceipt & {_id: Types.ObjectId})

export const toInventoryReceipt = (doc: InventoryReceiptInput): InventoryReceiptRes => {
    return {
        id: doc._id.toString(),
        import_date: doc.import_date,
        total_mount: doc.total_mount,
        supplierId: doc.supplierId.toString(),
        userId: doc.userId.toString(),
    }
}


export const toInventoryReceiptDetail = (doc: IInventoryReceiptRes): InventoryReceiptDetailRes => {
    return {
        //phần phiếu nhập
        id: doc._id.toString(),
        supplierId: doc.supplierId.toString(),
        userId: doc.userId.toString(),
        total_mount: doc.total_mount,
        import_date: doc.import_date,
        details: doc.details.map(detail => {
            return {
                //phần chi tiết phiếu nhập
                id: detail._id.toString(),
                importReceiptId: detail.importReceiptId.toString(),
                quality: detail.quality,
                import_price: detail.import_price,
                //phần sản phẩm
                productId: {
                    id: detail.productId._id.toString(),
                    product_name: detail.productId.product_name,
                    price: detail.productId.price,
                    quantity: detail.productId.quantity,
                    inventory_quantity: detail.productId.inventory_quantity,
                    categoryId: detail.productId.categoryId.toString(),
                    supplier: detail.productId.supplier,
                }
            }
        })
    }
}