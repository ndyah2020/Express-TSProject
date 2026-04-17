# Tổng Hợp Chi Tiết Các Bài Tập Nâng Cao (Express - TypeScript - Mongoose)

> ⚠️ **Lưu ý quan trọng**: Toàn bộ code trong file này chỉ mang tính tham khảo. 
---
## 1. Bài 1: Tìm Kiếm Nâng Cao, FilterQuery Động & Phân Trang (Advanced Filtering)
*Tái hiện chính xác phong cách `GetInventoryReceiptQueryReq` và `FilterQuery` của hệ thống.*

### A. Validation Interface (`src/validations/advanced.validation.ts`)
```typescript
export interface GetProductAdvancedQueryReq {
    page: number;
    limit: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort: string;
}
```

### B. Service Logic (`src/services/advanced.service.ts`)
```typescript
import { FilterQuery } from "mongoose";
import productModel, { IProduct } from "../models/product.model";
import { GetProductAdvancedQueryReq } from '../validations/advanced.validation';
import { toProduct } from "../mapper/product.mapper"; 

export class AdvancedService {
    advancedProductSearch = async (query: GetProductAdvancedQueryReq) => {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;

        const filter: FilterQuery<IProduct> = {};

        if (query.search) {
             filter.product_name = { $regex: query.search, $options: "i" };
        }

        if (query.minPrice || query.maxPrice) {
            filter.price = {};
            if (query.minPrice) filter.price.$gte = query.minPrice;
            if (query.maxPrice) filter.price.$lte = query.maxPrice;
        }
       
        let productSort = query.sort || "-createdAt";
        productSort = productSort.split(',').join(' ');

        const products = await productModel.find(filter)
                                           .limit(limit)
                                           .skip(skip)
                                           .sort(productSort)
                                           .populate("categoryId")
                                           .lean();
        
        return products.map(product => toProduct(product as any));
    }
}
export default new AdvancedService();
```

### C. Controller Layer (`src/controllers/advanced.controller.ts`)
```typescript
import { Request, NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import advancedService from '../services/advanced.service';
import { GetProductAdvancedQueryReq } from '../validations/advanced.validation';

export class AdvancedController {
    advancedSearch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query as unknown as GetProductAdvancedQueryReq;
            const result = await advancedService.advancedProductSearch(query);
            
            res.status(StatusCodes.OK).json({
                message: "Products retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
export default new AdvancedController();
```

---

## 2. Bài 2: Giao Dịch ACID (Database Transaction)
*Làm giống logic `create` trong `inventoryReceipt` nhưng được bật Session Transaction để bảo vệ tính vẹn toàn khi trừ kho.*

### A. Service Logic (`src/services/advanced.service.ts`)
```typescript
import mongoose from "mongoose";
import orderModel from "../models/order.model";
import orderDetailModel from "../models/orderDetail.model";
import productModel from "../models/product.model";

export class TransactionService {
    
    createComplexOrder = async (data: any, customerId: string) => {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const { sellerID, paymentMethod, items } = data;
            let totalOrderCost = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
            
            const orders = await orderModel.create(
                [{
                    customerID: customerId,
                    sellerID: sellerID,
                    totalCost: totalOrderCost,
                    paymentMethod: paymentMethod
                }],
                { session }
            ); 
            const newOrder = orders[0];
            
            const orderDetails = items.map((item: any) => ({
                orderID: newOrder._id,
                productID: item.productID,
                quantity: item.quantity,
                price: item.price,
                totalPrice: item.price * item.quantity,
            }));

            await orderDetailModel.create(orderDetails, { session });

            for (const item of items) {
                const product = await productModel.findById(item.productID).session(session);
                if (!product || product.inventory_quantity < item.quantity) {
                    throw new Error("Không đủ hàng trong kho");
                }

                await productModel.updateOne(
                    { _id: item.productID },
                    { $inc: { inventory_quantity: -item.quantity } }, 
                    { session }
                );
            }

            await session.commitTransaction();
            return newOrder;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}
export default new TransactionService();
```

---

## 3. Bài 3: Aggregation Framework (Báo Cáo Doanh Thu Thực Tế)
### Service Layer (`src/services/advanced.service.ts`)
```typescript
import orderModel from "../models/order.model";

export class ReportService {
    getMonthlyRevenue = async (year: number) => {
        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

        const result = await orderModel.aggregate([
            { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },       
                    totalRevenue: { $sum: "$totalCost" },
                    totalOrders: { $sum: 1 }             
                }
            },
            { $sort: { "_id": 1 } },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    totalRevenue: 1,
                    totalOrders: 1
                }
            }
        ]);
        return result;
    }
}
export default new ReportService();
```

---

## 4. Bài 4 Nông Cao Express: Trích Xuất Dữ kết Báo Cáo CSV (Export Data)
*Logic này cực kỳ ăn điểm môn hệ thống thông tin. Truy xuất và biến đổi Object JSON thành chuỗi file Text CSV.*

### A. Controller (`src/controllers/advanced.controller.ts`)
```typescript
import { Request, Response, NextFunction } from "express";
import productModel from "../models/product.model";

export class ExportController {
    
    exportProductsCSV = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await productModel.find().lean();
            
            // Báo cho Trình Duyệt đây là File Tải Về
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=products_report.csv");

            // Xây dựng chuỗi dữ liệu (Header + Rows)
            let csvText = "ProductID,Product_Name,Price,Quantity,Supplier\n";
            products.forEach(p => {
                csvText += `"${p._id}","${p.product_name}","${p.price}","${p.inventory_quantity}","${p.supplier}"\n`;
            });

            // Gọi send thay vì json()
            res.status(200).send(csvText);
        } catch (error) {
            next(error);
        }
    }
}
export default new ExportController();
```

---

## 5. Bài 5 Tối Ưu Hệ Thống: Caching Kết Quả Bằng Biến RAM NODE.JS (Memory Cache)
*Chặn đứng việc CSDL bị sập do có quá nhiều request thống kê báo cáo cùng lúc.*

### Service Layer (`src/services/advanced.service.ts`)
```typescript
import orderDetailModel from "../models/orderDetail.model";

export class CacheStatsService {
    // Lưu trữ RAM ảo bằng Class Properties
    private cacheStorage: any = {};    
    private expireLimit: number = 300_000; // Cache cứng 5 phút

    getTopSellingCached = async () => {
        const now = Date.now();
        
        // 1. Nếu trên RAM có dữ liệu và chưa hết hạn -> Ăn ngay không tốn CPU
        if (this.cacheStorage["topSelling"] && this.cacheStorage["topSellingExpiry"] > now) {
            return this.cacheStorage["topSelling"]; 
        }

        // 2. RAM trống hoặc bị mốc -> Bắt buộc Query DB
        const freshData = await orderDetailModel.aggregate([
            { $group: { _id: "$productID", totalSold: { $sum: "$quantity" } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);
        
        // 3. Ghi vĩnh viễn vào Memory cho lượt người sau
        this.cacheStorage["topSelling"] = freshData;
        this.cacheStorage["topSellingExpiry"] = now + this.expireLimit;

        return freshData;
    }
}
export default new CacheStatsService();
```

---

## Hướng dẫn khai báo Router & Áp Dụng Middleware
```typescript
import { Router } from "express";
import advancedController from "../controllers/advanced.controller";
// Dành cho bài toán Transaction
// import { isAuthenticated } from "../middlewares/auth.middleware"; 

const router = Router();

// Bài 1: Phân trang tìm kiếm FilterQuery
router.get("/products/search", advancedController.advancedSearch);

// Bài 2: Giao dịch có session
// router.post("/orders/transaction", isAuthenticated, advancedController.createComplexOrder);

// Bài 4: Xuất Data trực tiếp
// router.get("/products/export/csv", advancedController.exportProductsCSV);

export default router;
```
