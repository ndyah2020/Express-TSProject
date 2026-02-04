import express, { Request, Response } from 'express'
import { validate, validateBody } from '../middlewares'
import { registerSchema, userBodySchema } from '../middlewares/schemas'

const router = express.Router()

// Ví dụ 1: Dùng validate() cho toàn bộ request (body, query, params)
router.post('/register', validate(registerSchema), (req: Request, res: Response) => {
    // Nếu đến đây thì data đã được validate rồi
    const { email, name } = req.body
    // TODO: Hash password và lưu vào database
    
    res.json({
        success: true,
        message: 'User registered successfully',
        data: { email, name }
    })
})

// Ví dụ 2: Dùng validateBody() chỉ validate body
router.post('/login', validateBody(userBodySchema), (req: Request, res: Response) => {
    const { email } = req.body
    // TODO: Verify password và generate JWT token
    
    res.json({
        success: true,
        message: 'Login successful',
        data: { email }
    })
})

// Ví dụ 3: Dùng nhiều middleware cùng lúc (như token middleware)
// router.post('/protected', authMiddleware, validateBody(someSchema), (req, res) => {
//     // Handle protected route
// })

export default router
