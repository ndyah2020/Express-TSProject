import { z } from 'zod'

// Schema riêng cho body (dùng với validateBody)
export const registerBodySchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Password phải có ít nhất 6 ký tự'),
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự')
})
//trả về luôn interface sau này kh phải khai báo interface
export type RegisterBody = z.infer<typeof registerBodySchema>

// Schema cho register
export const registerSchema = z.object({
    body: registerBodySchema
})


export const loginBodySchema = z.object({
    email: z.string({
        required_error: "Email không được để trống"
    }).email('Email không hợp lệ'),

    password: z.string().min(1, 'Password không được để trống')
})

export type LoginBody = z.infer<typeof loginBodySchema>


// Schema cho login
export const loginSchema = z.object({
    body: loginBodySchema
})
