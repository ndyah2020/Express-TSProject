import { Router } from 'express'
import authController from '../controllers/auth.controller';
const router = Router()
// chưa có middlewares phần này bổ sung sau

// api/auth/register
router.post('/register', authController.register)

// api/auth/login
router.post('/login', authController.login)

//api/auth/logout
router.get('/logout', authController.logout)

//api/auth/refreshToken
router.post('/refresh-token', authController.refreshToken)
export default router