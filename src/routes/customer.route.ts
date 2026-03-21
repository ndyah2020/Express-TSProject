import { Router } from 'express';
import customerController from '../controllers/customer.controller';
import { validate } from '../middlewares/validate.middleware.';
import { getCustomersQuerySchema, createCustomerSchema, updateCustomerSchema, customerIdParamSchema } from '../validations/customer.validation';
const router = Router();

router.get('/', validate({ query: getCustomersQuerySchema }), customerController.getCustomers);
router.post('/', validate({ body: createCustomerSchema }), customerController.createCustomer);
router.put(
  '/:id', 
  validate({ params: customerIdParamSchema, body: updateCustomerSchema }), 
  customerController.updateCustomer
);
router.delete(
  '/:id',
  validate({ params: customerIdParamSchema }),
  customerController.deleteCustomer
);
export default router;