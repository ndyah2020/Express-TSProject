import { Router } from 'express'
import userController from '../controllers/user.controller';
const router = Router()
// chưa có middlewares phần này bổ sung sau
// api/user/me
router.get('/register', userController.register)

export default router;