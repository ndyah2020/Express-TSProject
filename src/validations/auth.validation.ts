import { z } from 'zod'

// Schema cho register
export const registerSchema = z.object({
    body: z.object({
        email: z.string().email('Email không hợp lệ'),
        password: z.string().min(6, 'Password phải có ít nhất 6 ký tự'),
        name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự')
    })
})

// Schema cho login
export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Email không hợp lệ'),
        password: z.string().min(1, 'Password không được để trống')
    })
})

// Schema riêng cho body (dùng với validateBody)
export const registerBodySchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Password phải có ít nhất 6 ký tự'),
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự')
})

export const loginBodySchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(1, 'Password không được để trống')
})
