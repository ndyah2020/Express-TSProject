import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createSupplierSchema, getSupplierQuerySchema, updateSupplierSchema } from '../validations/supplier.validation';
import supplierController from '../controllers/supplier.controller';

const router = Router()

router.use(authMiddleware.isAuthorized);
router.get("/get", validate({query: getSupplierQuerySchema}), supplierController.getQuery)
router.post("/create", validate({body: createSupplierSchema}), supplierController.create)
router.get("/get/:id", supplierController.getById)
router.delete("/delete/:id", supplierController.delete)
router.patch("/update/:id", validate({body: updateSupplierSchema}), supplierController.update)

export default router