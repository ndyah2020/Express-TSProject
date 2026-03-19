import Product, { IProduct } from "../models/product.model";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";

import { toProductRes } from "../mapper/product.mapper";
import { ProductRes } from "../interfaces/productRes.interface";

export class ProductService {
  // Lấy tất cả product
  async getAllProducts(): Promise<ProductRes[]> {
    try {
      const products = await Product.find().populate("categoryId");
      return products.map(toProductRes);
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to fetch products",
      );
    }
  }

  // Lấy product theo ID
  async getProductById(id: string): Promise<ProductRes> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid product ID");
    }

    const product = await Product.findById(id).populate("categoryId");

    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
    }

    return toProductRes(product);
  }

  // Tạo product
  async createProduct(data: Partial<IProduct>): Promise<ProductRes> {
    try {
      const newProduct = new Product(data);
      const saved = await newProduct.save();
      return toProductRes(saved);
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create product");
    }
  }

  // Cập nhật product
  async updateProduct(
    id: string,
    data: Partial<IProduct>,
  ): Promise<ProductRes> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid product ID");
    }

    const updated = await Product.findByIdAndUpdate(id, data, {
      new: true,
    }).populate("categoryId");

    if (!updated) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
    }

    return toProductRes(updated);
  }
  // Lấy product theo category
  async getProductsByCategory(categoryId: string): Promise<ProductRes[]> {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid category ID");
    }

    const products = await Product.find({
      categoryId: categoryId,
    }).populate("categoryId");

    return products.map(toProductRes);
  }
}

export default new ProductService();
