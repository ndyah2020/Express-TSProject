import { Router } from "express";
import ProductController from "../controllers/product.controller";
import { validateProduct } from "../validations/product.validation";

const router = Router();

router.get("", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.post("", validateProduct, ProductController.addProduct);
router.put("/:id", validateProduct, ProductController.updateProduct);


export default router;