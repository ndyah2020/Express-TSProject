import Router from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import categoryController from "../controllers/category.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  updateCategorySchema,
  createCategorySchema,
  getCategoryQuerySchema,
} from "../validations/category.validation";

const router = Router();

router.use(authMiddleware.isAuthorized); //cái nao bắc buộc phải có token thì viết dưới dòng này còn không thì viết ở trên dòng này

router.get("/get", validate({query: getCategoryQuerySchema}) ,categoryController.get);

router.get(
"/get/:id",
  categoryController.getById,
);

router.post(
  "/create",
  validate({ body: createCategorySchema }),
  categoryController.create,
);

router.patch(
  "/update/:id",
  validate({ body: updateCategorySchema }),
  categoryController.update,
);

router.delete(
  "/delete/:id",
  validate({ body: updateCategorySchema }),
  categoryController.delete,
);

export default router;
