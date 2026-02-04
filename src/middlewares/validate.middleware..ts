import { Request, Response, NextFunction } from 'express'
import {ZodType } from 'zod'

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
            next(error)
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
    validate,
    validateBody,
    validateQuery,
    validateParams
}