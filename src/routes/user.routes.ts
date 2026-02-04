import { Router } from 'express'
import userController from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = Router()
// chưa có middlewares phần này bổ sung sau
// api/users/list
router.get('/list', authMiddleware.isAuthorzied ,userController.listUsers)

export default router;