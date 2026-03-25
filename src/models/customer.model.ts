import mongoose, {HydratedDocument, Schema} from "mongoose";

export interface ICustomer {
    name: string,
    email: string,
    phone: string,
    address: string,
}

export type CustomerDocument = HydratedDocument<ICustomer>

const customerSchema = new Schema<ICustomer> (
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

export default mongoose.model<ICustomer>('Customer', customerSchema)