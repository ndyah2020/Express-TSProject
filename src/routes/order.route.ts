import Router from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import orderController from "../controllers/order.controller";
import { validate } from "../middlewares/validate.middleware";
import { createOrderSchema } from "../validations/order.validation";

const router = Router();

router.use(authMiddleware.isAuthorized);

router.get("/get", orderController.get);

router.post(
  "/create",
  validate({ body: createOrderSchema }),
  orderController.create,
);

export default router;
