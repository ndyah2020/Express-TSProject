import Product, { IProduct } from "../models/product.model";
import mongoose from "mongoose";

export class ProductService {
  getAllProducts = async (): Promise<IProduct[]> => {
    return Product.find().populate("categoryId");
  };

  // Lấy 1 product theo ID
  getProductById = async (id: string): Promise<IProduct | null> => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Product.findById(id).populate("categoryId");
  };

  // Thêm product mới
  createProduct = async (data: Partial<IProduct>): Promise<IProduct> => {
    const newProduct = new Product(data);
    return newProduct.save();
  };

  // Cập nhật product
  updateProduct = async (id: string, data: Partial<IProduct>): Promise<IProduct | null> => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Product.findByIdAndUpdate(id, data, { new: true });
  };

}

export default new ProductService();