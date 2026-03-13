import { Router } from "express";
import ProductController from "../controllers/product.controller";
import {
  idParamsSchema,
  productSchema,
} from "../validations/product.validation";
import { validate } from "../middlewares/validate.middleware.";

const router = Router();

router.get("", ProductController.getAllProducts);
router.get(
  "/:id",
  validate({ params: idParamsSchema }),
  ProductController.getProductById,
);
router.post(
  "",
  validate({ body: productSchema }),
  ProductController.createProduct,
);
router.put(
  "/:id",
  validate({ params: idParamsSchema, body: productSchema }),
  ProductController.updateProduct,
);

export default router;
