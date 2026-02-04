import { Request, Response, NextFunction } from 'express'
import {ZodError, ZodType } from 'zod'
import ApiError from '../utils/ApiError'
import { StatusCodes } from 'http-status-codes'


//hàm này để xử lý error quăng ra 
const handleZodError = (err: unknown, next: NextFunction) => {
    if(err instanceof ZodError) {
        const erroMessage = err.errors.map(e => e.message).join(', ')
        console.log(erroMessage)

        return next(new ApiError(StatusCodes.BAD_REQUEST, erroMessage))
    }
    //bắt lỗi khác nếu không phải từ zod error
    next()
}

const validate = (schema: ZodType) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            })
            next()
        } catch (error: unknown) {
            handleZodError(error, next)
        }
    }
}

// Middleware cho từng loại riêng
const validateBody = (schema: ZodType) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body)
            next()
        } catch (error: unknown) {
            handleZodError(error, next)
        }
    }
}

const validateQuery = (schema: ZodType) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            req.query = await schema.parseAsync(req.query)
            next()
        } catch (error: unknown) {
            handleZodError(error, next)
        }
    }
}

const validateParams = (schema: ZodType) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            req.params = await schema.parseAsync(req.params)
            next()
        } catch (error: unknown) {           
           handleZodError(error, next)
        }
    }
}

export const validateMiddleware = {
    validate,
    validateBody,
    validateQuery,
    validateParams
}