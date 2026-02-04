import { z } from 'zod'

// Schema riêng cho body (dùng với validateBody)
export const registerBodySchema = z.object({
    username: z.string().min(1, "Username không được bỏ trống")
                        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,"User phải chứa ít nhất 1 chữ và 1 số"),

    password: z.string().min(6, 'Password phải có ít nhất 6 ký tự'),
})
//trả về luôn interface sau này kh phải khai báo interface
export type RegisterBody = z.infer<typeof registerBodySchema>

// Schema cho register
export const registerSchema = z.object({
    body: registerBodySchema
})


export const loginBodySchema = z.object({
    username: z.string().min(1, "Username không được bỏ trống"),
    password: z.string().min(1, 'Password không được để trống')
})

export type LoginBody = z.infer<typeof loginBodySchema>


// Schema cho login
export const loginSchema = z.object({
    body: loginBodySchema
})
