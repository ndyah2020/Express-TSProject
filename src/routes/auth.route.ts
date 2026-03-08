import { Router } from 'express'
import authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware.'
import { loginBodySchema, registerBodySchema } from '../validations/auth.validation';
const router = Router()

// api/auth/register
router.post('/register', validate({body: registerBodySchema}) ,authController.register)

// api/auth/login
router.post('/login', validate({body: loginBodySchema}) ,authController.login)

//api/auth/logout
router.get('/logout', authController.logout)

//api/auth/refreshToken
router.post('/refresh-token', authController.refreshToken)
export default router