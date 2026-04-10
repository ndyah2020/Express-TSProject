import { Request, NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CreateInventoryReceiptReq } from '../validations/inventoryReceipt.validation';
import  inventoryReceiptService from '../services/inventoryReceipt.service';

export class InventoryController {
    get = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(StatusCodes.OK).json("")
        } catch (error) {
            next(error)
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: CreateInventoryReceiptReq = req.body
            const userId = req.userDecoded?.userId as string

            const result = await inventoryReceiptService.create(data, userId)
            res.status(StatusCodes.CREATED).json({
                message: "Create inventory receipt successfully",
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const receiptId = req.params.id
            const result = await inventoryReceiptService.getById(receiptId)
            res.status(StatusCodes.OK).json(result)
            res.status(StatusCodes.OK).json("")
        } catch (error) {
            next(error)
        }
    }
}

export default new InventoryController