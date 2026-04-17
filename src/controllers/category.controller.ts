import { NextFunction, Request, Response } from 'express';
import categoryService from '../services/category.service';
import { StatusCodes } from 'http-status-codes';
import { GetCategoryQueryReq } from '../validations/category.validation';
import { ApiRes } from '../utils/ApiReponse';
import { CategoryRes } from '../interfaces/category.interface';

export class ProductController {
    get = async (req: Request, res: Response, next: NextFunction) => {
        try { 
            const categoryQuery = req.query as unknown as GetCategoryQueryReq
            const result = await categoryService.getQuery(categoryQuery)
            res.status(StatusCodes.OK).json(result)
        }catch (error) {
            next(error)
        }
    }


    getById = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryId = req.params.id
            const result = await categoryService.getById(categoryId)
            return ApiRes<CategoryRes>(res, true ,StatusCodes.OK, "OK", result)
        }catch (error) {
            next(error)
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
            next(error)
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
            next(error)
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
            next(error)
        }
    }
}
export default new ProductController()