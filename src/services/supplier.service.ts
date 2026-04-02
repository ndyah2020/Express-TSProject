import { StatusCodes } from "http-status-codes";
import { SupplierRes } from "../interfaces/suplier.interface";
import { toSupplierRes } from "../mapper/supplier.mapper";
import supplierModel, { ISupplier } from "../models/supplier.model";
import ApiError from "../utils/ApiError";
import { CreateSupplierReq, GetSupplierQueryReq } from "../validations/supplier.validation"
import { FilterQuery } from 'mongoose';

export class SupplierService {
    getQuery = async(query: GetSupplierQueryReq): Promise<SupplierRes[]> => {
        const page = query.page
        const limit = query.limit
        const skip = (page - 1)*limit

        const filter: FilterQuery<ISupplier> =  {}

        if(query.search) {
            filter.$or =  [
                {category_name: {$regex: query.search, $options: "i"}},
                {address: {$regex: query.search, $options: "i"}},
                {phone_number:{$regex: query.search, $options: "i"}}
            ]
        }

        let categorySort = query.sort
        categorySort = query.sort.split(',').join(' ')

        const suppliers = await supplierModel.find(filter).limit(limit).skip(skip).sort(categorySort).lean()


        return suppliers.map(supplier => toSupplierRes(supplier))
    }
    
    getById = async(supplierId: string): Promise<SupplierRes> => {
        const supplier = await supplierModel.findById(supplierId)
        
        if(!supplier) throw new ApiError(StatusCodes.NOT_FOUND, "Supplier not fonund")

        return toSupplierRes(supplier)
    }

    create = async(supplier: CreateSupplierReq): Promise<SupplierRes> => {
        const newSupplier = await supplierModel.create(supplier)
        if(!newSupplier) throw new ApiError(StatusCodes.BAD_REQUEST, "Create failed users")
        return toSupplierRes(newSupplier)
    }

    delete = async(supplierId: string): Promise<SupplierRes> => {
        const deleteSupplier = await supplierModel.findOneAndDelete({_id: supplierId})
        if(!deleteSupplier) throw new ApiError(StatusCodes.BAD_REQUEST, "Delete failed users")
        return toSupplierRes(deleteSupplier)
    }

}

export default new SupplierService()