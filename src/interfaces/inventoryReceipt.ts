import { Types } from "mongoose";
import { IPopulatedProduct, ProductRes } from "./productRes.interface";

// phần này là kiểu dữ liệu trả vê sau query từ mongooes ra
// ****

export interface IPopulatedReceiptDetail {
    _id: Types.ObjectId;
    importReceiptId: Types.ObjectId;
    productId: IPopulatedProduct;
    quality: number;
    import_price: number;
    createdAt: Date;
    updatedAt: Date;
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
// ****

// từ phần ở trên mới chuyển đổi sang ở dưới đây thông qua mapper 
export interface InventoryReceiptRes {
    id: string,
    import_date: Date,
    total_mount: number,
    supplierId: string,
    userId: string,
}


//phần trả về chi tiết
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