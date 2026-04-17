import { Types } from "mongoose";
import { ProductMapperInputDocument, ProductRes, ProductRes2 } from "../interfaces/productRes.interface";

type productInput = {
  _id: Types.ObjectId | string;
  product_name: string;
  price: number;
  quantity: number;
  inventory_quantity: number;
  categoryId: Types.ObjectId | string;
  supplier: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export const toProductRes = (doc: productInput): ProductRes => {
  return {
    id:
      doc._id instanceof Types.ObjectId
        ? doc._id.toString()
        : String(doc._id),

    product_name: doc.product_name,
    price: doc.price,
    quantity: doc.quantity,
    inventory_quantity: doc.inventory_quantity,

    categoryId:
      doc.categoryId instanceof Types.ObjectId
        ? doc.categoryId.toString()
        : String(doc.categoryId),

    supplier: doc.supplier,

    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

// type ProductInput = ProductDocument | (IProduct2 & {_id: Types.ObjectId}) 

export const toProduct2 = (doc: ProductMapperInputDocument): ProductRes2 => {
  return {
    id: doc._id.toString(),
    product_name: doc.product_name,
    price: doc.price,
    quantity: doc.quantity,
    inventory_quantity: doc.inventory_quantity,
    categoryId: {
      id: doc._id.toString(),
      category_name: doc.categoryId.category_name,
      description: doc.categoryId.description
    },
    supplier: doc.supplier,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}


