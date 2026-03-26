import { Router } from 'express'
import userController from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { userQuerySchema } from '../validations/user.validation';
const router = Router()
// chưa có middlewares phần này bổ sung sau
// api/users/list
router.use(authMiddleware.isAuthorized)
router.get('/get', validate({query: userQuerySchema}) ,userController.getQuery)

export default router;