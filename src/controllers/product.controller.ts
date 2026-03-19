import { Request, Response, NextFunction } from "express";
import ProductService from "../services/product.service";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/ApiReponse";
import { ProductRes } from "../interfaces/productRes.interface";

class ProductController {
  // GET /products
  getAllProducts = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const products: ProductRes[] = await ProductService.getAllProducts();

      new ApiResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: "Products retrieved successfully",
        data: products,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  // GET /products/:id
  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product: ProductRes = await ProductService.getProductById(
        req.params.id,
      );
      new ApiResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: "Product retrieved successfully",
        data: product,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // POST /products
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product: ProductRes = await ProductService.createProduct(req.body);
      new ApiResponse({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Product created successfully",
        data: product,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // PATCH /products/:id
  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product: ProductRes = await ProductService.updateProduct(
        req.params.id,
        req.body,
      );
      new ApiResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: "Product updated successfully",
        data: product,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // GET /products/category/:id
  getProductsByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const categoryId = req.params.id;
      const products: ProductRes[] =
        await ProductService.getProductsByCategory(categoryId);
      new ApiResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: "Products retrieved by category successfully",
        data: products,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

export default new ProductController();
