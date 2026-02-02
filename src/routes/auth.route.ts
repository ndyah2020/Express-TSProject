import { Router } from 'express'
import authController from '../controllers/auth.controller';
const router = Router()
// chưa có middlewares phần này bổ sung sau

// api/auch/register
router.post('/register', authController.register)

// api/auch/login
router.post('/login', authController.login)
export default router