import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createSupplierSchema, getSupplierQuerySchema } from '../validations/supplier.validation';
import supplierController from '../controllers/supplier.controller';

const router = Router()

router.use(authMiddleware.isAuthorized);
router.get("/get", validate({query: getSupplierQuerySchema}), supplierController.getQuery)
router.post("/create", validate({body: createSupplierSchema}), supplierController.create)
router.get("/get/:id", supplierController.getById)
export default router