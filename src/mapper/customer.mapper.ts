import { Types } from 'mongoose';
import { ICustomer } from '../models/customer.model';
import { CustomerRes } from "../interfaces/customers.interface";

type customerInput = ICustomer & {_id: Types.ObjectId}

export const toCustomerRes = (doc: customerInput): CustomerRes => {
    return {
        id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        address: doc.address,
    }
}

