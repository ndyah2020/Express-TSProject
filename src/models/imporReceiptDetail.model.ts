import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export interface IImportReceiptDetail {
    importReceiptId: Types.ObjectId,
    productId: Types.ObjectId,
    quality: number,
    import_price: number
}

export type IImportReceiptDetailDocument = HydratedDocument<IImportReceiptDetail>

const importReceiptDetailSchema = new Schema<IImportReceiptDetail> ({
    importReceiptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ImportReceipt',
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

export default mongoose.model<IImportReceiptDetail>('ImportReceiptDetail', importReceiptDetailSchema)