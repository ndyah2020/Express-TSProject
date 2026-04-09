import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export interface IInventoryReceiptDetail {
    importReceiptId: Types.ObjectId,
    productId: Types.ObjectId,
    quality: number,
    import_price: number
}

export type IInventoryReceiptDetailDocument = HydratedDocument<IInventoryReceiptDetail>

const inventoryReceiptDetailSchema = new Schema<IInventoryReceiptDetail> ({
    importReceiptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InventoryReceipt',
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quality: {
        type: Number,
        required: true,
    },
    import_price: {
        type: Number,
        required: true,
    }
})

export default mongoose.model<IInventoryReceiptDetail>('InventoryReceiptDetail', inventoryReceiptDetailSchema)