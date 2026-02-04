import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'

export const validate = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            })
            next()
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.errors.map(err => ({
                        path: err.path.join('.'),
                        message: err.message
                    }))
                })
            }
            next(error)
        }
    }
}

// Middleware cho từng loại riêng
export const validateBody = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body)
            next()
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.errors.map(err => ({
                        path: err.path.join('.'),
                        message: err.message
                    }))
                })
            }
            next(error)
        }
    }
}

export const validateQuery = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.query = await schema.parseAsync(req.query)
            next()
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.errors.map(err => ({
                        path: err.path.join('.'),
                        message: err.message
                    }))
                })
            }
            next(error)
        }
    }
}

export const validateParams = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.params = await schema.parseAsync(req.params)
            next()
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.errors.map(err => ({
                        path: err.path.join('.'),
                        message: err.message
                    }))
                })
            }
            next(error)
        }
    }
}
