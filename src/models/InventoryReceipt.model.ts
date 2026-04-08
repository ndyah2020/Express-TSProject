import mongoose, {HydratedDocument, Schema, Types} from "mongoose";

export interface IInventoryReceipt {
    supplierId: Types.ObjectId,
    userId: Types.ObjectId,
    total_mount: number,
    import_date: Date
}

export type IInventoryReceiptDocument = HydratedDocument<IInventoryReceipt>

const inventoryReceiptSchema = new Schema<IInventoryReceipt> ({
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
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

export default mongoose.model<IInventoryReceipt>("InventoryReceipt", inventoryReceiptSchema)