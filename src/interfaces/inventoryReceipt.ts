import { Types } from "mongoose";
import { ProductRes } from "./productRes.interface";

// phần này là kiểu dữ liệu trả vê sau query
export interface IPopulatedProduct {
  _id: Types.ObjectId;
  product_name: string;
  price: number;
  quantity: number;
  inventory_quantity: number;
  categoryId: Types.ObjectId;
  supplier: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPopulatedReceiptDetail {
  _id: Types.ObjectId;
  importReceiptId: Types.ObjectId;
  productId: IPopulatedProduct;
  quality: number;
  import_price: number;
}


export interface IInventoryReceiptRes{
  _id: Types.ObjectId;
  supplierId: Types.ObjectId;
  userId: Types.ObjectId;
  total_mount: number;
  import_date: Date;
  createdAt: Date;
  updatedAt: Date;
  details: IPopulatedReceiptDetail[]; 
}

//phần này dành cho mapper
export interface InventoryReceiptRes {
    id: string,
    import_date: Date,
    total_mount: number,
    supplierId: string,
    userId: string,
}

export interface IInventoryReceiptDetail {
    id: string;
    importReceiptId: string
    productId: ProductRes,
    quality: number,
    import_price: number
}

export interface InventoryReceiptDetailRes {
  id: string;
  supplierId: string;
  userId: string;
  total_mount: number;
  import_date: Date;
  details: IInventoryReceiptDetail[];
}