import mongoose, {HydratedDocument, Schema, Types} from "mongoose";

export interface IImportReceipt {
    supplierId: Types.ObjectId,
    userId: Types.ObjectId,
    total_mount: number,
    import_date: Date
}

export type IImportReceiptDocument = HydratedDocument<IImportReceipt>

const importReceiptSchema = new Schema<IImportReceipt> ({
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Suplier",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    total_mount: {
        type: Number,
        required: true,
        default: 0
    },
    import_date: {
        type: Date,
        required: true
    }
}, {timestamps: true})

export default mongoose.model<IImportReceipt>("ImportReceipt", importReceiptSchema)