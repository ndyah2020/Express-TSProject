import { ProductDocument } from "../models/product.model";
import { CategoryMapper, CategoryRes } from "./category.interface";
import Types from 'mongoose';

interface productBase2 {
  product_name: string;
  price: number;
  quantity: number;
  inventory_quantity: number;
  supplier: string;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// dùng cho hóa đơn và phiếu nhập
export interface IPopulatedProduct extends productBase2{
    _id: Types.ObjectId;
}


export interface ProductRes extends productBase2{
  id: string;
}


export interface ProductMapperInputDocument extends Omit<ProductDocument, "categoryId">{
  categoryId: CategoryMapper
}

export interface ProductRes2 extends Omit<productBase2, "categoryId">{
  id: string;
  categoryId: CategoryRes;
}