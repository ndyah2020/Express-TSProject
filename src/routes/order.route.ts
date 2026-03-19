import Router from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import orderController from "../controllers/order.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createOrderSchema,
  customerIdParamsSchema,
  idParamsSchema,
  sellerIdParamsSchema,
  timeRangeParamsSchema,
} from "../validations/order.validation";

const router = Router();

router.use(authMiddleware.isAuthorized);

router.get("/get", orderController.get);

router.get(
  "/get/time-range",
  validate({ body: timeRangeParamsSchema }),
  orderController.getByTimeRange,
);

router.get(
  "/get/customer/:customerId",
  validate({ params: customerIdParamsSchema }),
  orderController.getByCustomerId,
);

router.get(
  "/get/seller/:sellerId",
  validate({ params: sellerIdParamsSchema }),
  orderController.getBySellerId,
);

router.get(
  "/get/:id",
  validate({ params: idParamsSchema }),
  orderController.getById,
);

router.post(
  "/create",
  validate({ body: createOrderSchema }),
  orderController.create,
);

export default router;
