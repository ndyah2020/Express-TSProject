import { NextFunction, Request, Response } from 'express';
import categoryService from '../services/category.service';
import { StatusCodes } from 'http-status-codes';

export class ProductController {
    get = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await categoryService.get()

            res.status(StatusCodes.OK).json(result)
        }catch (error) {
            next()
        }
    }

    getById = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryId = req.params.id
            const result = await categoryService.getById(categoryId)

            res.status(StatusCodes.OK).json(result)
        }catch (error) {
            next()
        }
    }

    create = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const category = req.body
            const result = await categoryService.create(category)

            res.status(StatusCodes.OK).json({
                message: "Create category success",
                data: result
            })

        }catch (error) {
            next()
        }
    }

    update = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryId = req.params.id
            const category = req.body
            const result = await categoryService.update(categoryId, category)

            res.status(StatusCodes.OK).json({
                message: "Update category success",
                data: result
            })
        }catch (error) {
            next()
        }
    }

    delete = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryId = req.params.id
            const result = await categoryService.delete(categoryId)

             res.status(StatusCodes.OK).json({
                message: "Delete category success",
                data: result
            })
        }catch (error) {
            next()
        }
    }
}
export default new ProductController()