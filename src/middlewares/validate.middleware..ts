import { Request, Response, NextFunction } from 'express'
import {ZodType } from 'zod'

// Middleware cho từng loại riêng
const validateBody = (schema: ZodType) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body)
            next()
        } catch (error: unknown) {
            next(error)
        }
    }
}

const validateQuery = (schema: ZodType) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            req.query = await schema.parseAsync(req.query)
            next()
        } catch (error: unknown) {
            next(error)
        }
    }
}

const validateParams = (schema: ZodType) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            req.params = await schema.parseAsync(req.params)
            next()
        } catch (error: unknown) {           
           next(error)
        }
    }
}

export const validateMiddleware = {
    validateBody,
    validateQuery,
    validateParams
}