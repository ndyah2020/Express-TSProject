import Router from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import customerController from "../controllers/customer.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  idParamsSchema,
  updateCustomerSchema,
  createCustomerSchema,
} from "../validations/customer.validation";

const router = Router();

router.use(authMiddleware.isAuthorized);

router.get("/get", customerController.get);

router.get(
  "/get/:id",
  validate({ params: idParamsSchema }),
  customerController.getById,
);

router.post(
  "/create",
  validate({ body: createCustomerSchema }),
  customerController.create,
);

router.patch(
  "/update/:id",
  validate({ params: idParamsSchema, body: updateCustomerSchema }),
  customerController.update,
);

router.delete(
  "/delete/:id",
  validate({ params: idParamsSchema, body: updateCustomerSchema }),
  customerController.delete,
);

export default router;