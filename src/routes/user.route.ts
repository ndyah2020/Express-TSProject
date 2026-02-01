import { Router } from 'express'
import userController from '../controllers/auth.controller';
const router = Router()
// chưa có middlewares phần này bổ sung sau
// api/user/me
router.post('/register', userController.register)
router.post('/login', userController.login)
export default router;