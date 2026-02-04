import { z } from 'zod'

// Ví dụ schema cho user registration
export const registerSchema = z.object({
    body: z.object({
        email: z.string().email('Email không hợp lệ'),
        password: z.string().min(6, 'Password phải có ít nhất 6 ký tự'),
        name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự')
    })
})

// Ví dụ schema cho user login
export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Email không hợp lệ'),
        password: z.string().min(1, 'Password không được để trống')
    })
})

// Ví dụ schema cho params
export const idParamSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID không hợp lệ')
    })
})

// Ví dụ schema riêng cho body (dùng với validateBody)
export const userBodySchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Password phải có ít nhất 6 ký tự'),
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').optional()
})
