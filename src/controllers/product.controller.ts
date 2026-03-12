import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ProductService from "../services/product.service";

export class ProductController {
  getAllProducts = async (_req: Request, res: Response) => {
    try {
      const products = await ProductService.getAllProducts();
      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        successes: true,
        data: products,
        message: "List of all products",
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        successes: false,
        data: [],
        message: "Error fetching products",
        error,
      });
    }
  };

  getProductById = async (req: Request, res: Response) => {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (!product)
        return res.status(StatusCodes.NOT_FOUND).json({
          statusCode: StatusCodes.NOT_FOUND,
          successes: false,
          data: [],
          message: "Product not found",
        });
      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        successes: true,
        data: product,
        message: "fetch product by id: " + product.id,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        successes: false,
        data: [],
        message: "Error fetching product",
        error,
      });
    }
  };

  addProduct = async (req: Request, res: Response) => {
    try {
      const newProduct = await ProductService.createProduct(req.body);
      res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        successes: true,
        data: newProduct,
        message: "create a product success",
      });
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Error creating product", error });
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const updated = await ProductService.updateProduct(
        req.params.id,
        req.body,
      );
      if (!updated)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({
            statusCode: StatusCodes.NOT_FOUND,
            successes: false,
            data: [],
            message: "Product not found",
          });
      res.status(StatusCodes.OK).json(updated);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error updating product", error });
    }
  };
}

export default new ProductController();
