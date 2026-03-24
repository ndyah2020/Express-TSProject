import { Router } from 'express';
import customerController from '../controllers/customer.controller';
import { validate } from '../middlewares/validate.middleware';
import { getCustomersQuerySchema, createCustomerSchema, updateCustomerSchema, customerIdParamSchema } from '../validations/customer.validation';
const router = Router();

router.get('/', validate({ query: getCustomersQuerySchema }), customerController.get);
router.post('/', validate({ body: createCustomerSchema }), customerController.create);
router.put(
  '/:id', 
  validate({ params: customerIdParamSchema, body: updateCustomerSchema }), 
  customerController.update
);
router.delete(
  '/:id',
  validate({ params: customerIdParamSchema }),
  customerController.delete
);
export default router;