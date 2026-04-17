import { IPopulatedProduct, ProductRes } from "./productRes.interface";
import Types from 'mongoose';

interface OrderBase {
  customerID: string;
  sellerID: string;
  totalCost: number;
  paymentMethod: string;
}

interface OrderDetailsBase {
  productID: string;
  quantity: number;
  price: number;
  totalPrice: number;
}
//phần ngoài không care
export interface OrderRes extends OrderBase{
  id: string;
  details?: OrderDetailsBase[];
}



//phần viết lại document trả về từ mongoose
//detail document
interface OrderDetailsDocument extends Omit<OrderDetailsBase, "productID"> {
  _id: string,
  productID: IPopulatedProduct,
  createdAt: Date,
  updatedAt: Date,
}

export interface OrtherDocument extends OrderBase{
  _id: Types.ObjectId
  details: OrderDetailsDocument[]
  createdAt: Date,
  updatedAt: Date,
}

//phần mong muốn trả ra tự làm res
interface OrderDetailRes extends Omit<OrderDetailsBase, 'productID'>{
  id: string,
  productID: ProductRes,
}

export interface OrderRes2 extends OrderBase{
  id: string
  createdAt: Date,
  details: OrderDetailRes[]
}
