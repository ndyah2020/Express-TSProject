import { Types } from 'mongoose';
import { ISupplier, ISupplierDocument } from '../models/supplier.model';
import { SupplierRes } from '../interfaces/suplier.interface';

type SupplierInput = ISupplierDocument | (ISupplier & {_id: Types.ObjectId})


export const toSupplierRes = (doc: SupplierInput): SupplierRes => {
    return {
        id: doc._id.toString(),
        supplier_name: doc.supplier_name,
        phone_number: doc.phone_number,
        address: doc.address
    }
}