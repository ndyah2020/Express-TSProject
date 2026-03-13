import Product, { IProduct } from "../models/product.model";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";

export class ProductService {

  // Lấy tất cả product
  async getAllProducts(): Promise<IProduct[]> {
    try {
      return await Product.find().populate("categoryId");
    } catch (error) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to fetch products");
    }
  }

  // Lấy product theo ID
  async getProductById(id: string): Promise<IProduct> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid product ID");
    }
    const product = await Product.findById(id).populate("categoryId");
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
    }
    return product;
  }

  // Tạo product
  async createProduct(data: Partial<IProduct>): Promise<IProduct> {

    try {

      const newProduct = new Product(data);

      return await newProduct.save();

    } catch (error) {

      throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create product");

    }

  }

  // Cập nhật product
  async updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct> {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid product ID");
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );

    if (!updated) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
    }

    return updated;
  }
  // Lấy product theo category
  async getProductsByCategory(categoryId: string): Promise<IProduct[]> {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid category ID");
    }
    return await Product.find({
      categoryId: categoryId
    }).populate("categoryId");

  }

}

export default new ProductService();