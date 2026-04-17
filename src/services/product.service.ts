import Product, { IProduct } from "../models/product.model";
import mongoose, { FilterQuery } from "mongoose";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";

import { toProduct2, toProductRes } from "../mapper/product.mapper";
import { ProductMapperInputDocument, ProductRes, ProductRes2 } from "../interfaces/productRes.interface";
import { ProductQueryReq } from "../validations/product.validation";


export class ProductService {
  // Lấy tất cả product
  async getAllProducts(query: ProductQueryReq): Promise<ProductRes2[]> {
      const page = query.page
      const limit = query.limit
      const skip = (page - 1) * limit

      let productSort = query.sort
      
      productSort = query.sort.split(',').join(' ')
      
      let filter: FilterQuery<IProduct> = {}

      if(query.search) {
          filter.$or = [
            {product_name: {$regex: query.search, $options: "i"}},
            {supplier: {$regex: query.search, $options: "i"}},
          ]
      }

      if(query.minPrice || query.maxPrice) {
        filter.price = {}
        if(query.minPrice) filter.price.$gte = query.minPrice
        if(query.maxPrice) filter.price.$lte = query.maxPrice
      }

      if(query.minInventory || query.maxInventory) {
          filter.inventory_quantity = {}
        if(query.minInventory) filter.price.$gte = query.minInventory
        if(query.maxInventory) filter.price.$lte = query.maxPrice
      }

      const products = await Product.find(filter).populate("categoryId")
                                    .limit(limit).skip(skip)
                                    .sort(productSort)
                                    .lean<ProductMapperInputDocument[]>();

      return products.map(product => toProduct2(product));
  }

  getAll2 = async() => {
    const products = await Product.find().populate("categoryId").lean();
    return products;
  }

  // Lấy product theo ID
  async getProductById(id: string): Promise<ProductRes2> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid product ID");
    }

    const product = await Product.findById(id).populate("categoryId").lean<ProductMapperInputDocument>();

    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
    }

    return toProduct2(product);
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
    }).populate("categoryId").lean();

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

  lowStock = async() => {
    
  }
}

export default new ProductService();
