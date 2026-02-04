import { z } from 'zod'

// Schema cho params (MongoDB ObjectId)
export const userIdParamSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'User ID không hợp lệ')
    })
})

// Schema cho update user
export const updateUserSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').optional(),
        email: z.string().email('Email không hợp lệ').optional(),
        phone: z.string().optional(),
        avatar: z.string().url('Avatar phải là URL hợp lệ').optional()
    })
})

// Schema cho query params (pagination, search)
export const getUsersQuerySchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).transform(Number).default('1'),
        limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
        search: z.string().optional()
    })
})

// Schema riêng cho body
export const updateUserBodySchema = z.object({
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').optional(),
    email: z.string().email('Email không hợp lệ').optional(),
    phone: z.string().optional(),
    avatar: z.string().url('Avatar phải là URL hợp lệ').optional()
})
