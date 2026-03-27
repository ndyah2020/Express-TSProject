import mongoose, { HydratedDocument, Schema } from "mongoose";

export interface ISupplier {
    supplier_name: string,
    number_phone: string,
    address: string,
}

export type ISupplierDocument = HydratedDocument<ISupplier>

const supplierSchema = new Schema<ISupplier> ({
    supplier_name: {
        type: String,
        required: true,
    },
    number_phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
}, {timestamps: true})

export default mongoose.model<ISupplier> ("Supplier", supplierSchema)