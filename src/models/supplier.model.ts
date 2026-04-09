import mongoose, { HydratedDocument, Schema } from "mongoose";
// import { preventDeletePlugin } from "../utils/dbHook";

export interface ISupplier {
    supplier_name: string,
    phone_number: string,
    address: string,
}

export type ISupplierDocument = HydratedDocument<ISupplier>

const supplierSchema = new Schema<ISupplier> ({
    supplier_name: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
}, {timestamps: true})

// supplierSchema.plugin(preventDeletePlugin, {
//     refModel: "InventoryReceipt",
//     foreign_field: "supplierId",
//     message: "This supplier in use, Cann't delete",
// })

export default mongoose.model<ISupplier> ("Supplier", supplierSchema)