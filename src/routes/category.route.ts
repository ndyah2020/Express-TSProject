import Router from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import categoryController from '../controllers/category.controller';
import { validate } from '../middlewares/validate.middleware.';
import { idParamsSchema, updateCategorySchema, createCategorySchema } from '../validations/category.validation';


const router = Router()

router.use(authMiddleware.isAuthorized) //cái nao bắc buộc phải có token thì viết dưới dòng này còn không thì viết ở trên dòng này

router.get('/get', categoryController.get)

router.get('/get/:id', validate({params: idParamsSchema}), categoryController.getById)

router.post('/create', validate({body: createCategorySchema}), categoryController.create)

router.patch('/update/:id', validate({params: idParamsSchema, body: updateCategorySchema}), categoryController.update)

router.delete('/delete/:id', validate({params: idParamsSchema, body: updateCategorySchema}), categoryController.delete)

export default router