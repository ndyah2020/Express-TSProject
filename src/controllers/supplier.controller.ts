import { NextFunction, Request, Response } from "express"
import { GetSupplierQueryReq } from '../validations/supplier.validation';
import supplierService from "../services/supplier.service";
import { StatusCodes } from "http-status-codes"


export class SupplierController {
    getQuery = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const supplierQuery = req.query as unknown as GetSupplierQueryReq
            const result = await supplierService.getQuery(supplierQuery)

            res.status(StatusCodes.OK).json(result)
            
        } catch (error) {
            next(error)
        }
    }

    getById = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const supplierId = req.params.id
            
            const result = await supplierService.getById(supplierId)
            res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    }
    
    create = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const supplier = req.body
            const result = await supplierService.create(supplier)
            res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    }

    delete = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const supplierId = req.body.id
                        
            const result = await supplierService.delete(supplierId)
            res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    }
}   

export default new SupplierController()