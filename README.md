# Tổng Hợp Chi Tiết Các Bài Tập Nâng Cao (Express - TypeScript - Mongoose)

> ⚠️ **Lưu ý**: Toàn bộ code trong file này mang tính tham khảo. Quá trình triển khai theo thứ tự: `Validation Interface -> Service -> Controller -> Route`.

---

## 1. Bài 1: Tìm Kiếm, Lọc Động và Phân Trang (Advanced Filtering)
Lấy danh sách sản phẩm với các filter động như string, khoảng giá (minPrice, maxPrice) và sắp xếp. Sử dụng interface `FilterQuery` của Mongoose.

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

## 2. Bài 2: Giao Dịch Cơ Sở Dữ Liệu (Database Transaction)
Áp dụng Mongoose Session để nhóm các thao tác: tính tổng giá, tạo order, tạo orderDetail và giảm hàng tồn qua `updateOne({ $inc: ... })`. Nếu xảy ra lỗi sẽ bị rollback toàn bộ.

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

## 3. Bài 3: Báo Cáo Doanh Thu (Aggregation)
Sử dụng Aggregation Framework của Mongoose để thống kê và tính tổng tiền theo từng tháng trong một năm.

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

## 4. Bài 4: Xuất Dữ Liệu (Export To CSV)
Controller nhận dữ liệu từ mongoose và trả ra một file văn bản định dạng `.csv` dựa vào config headers.

### A. Controller (`src/controllers/advanced.controller.ts`)
```typescript
import { Request, Response, NextFunction } from "express";
import productModel from "../models/product.model";

export class ExportController {
    
    exportProductsCSV = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await productModel.find().lean();
            
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=products_report.csv");

            let csvText = "ProductID,Product_Name,Price,Quantity,Supplier\n";
            products.forEach(p => {
                csvText += `"${p._id}","${p.product_name}","${p.price}","${p.inventory_quantity}","${p.supplier}"\n`;
            });

            res.status(200).send(csvText);
        } catch (error) {
            next(error);
        }
    }
}
export default new ExportController();
```

---

## 5. Bài 5: Bộ Nhớ Đệm Ứng Dụng (In-Memory Cache)
Kỹ thuật cache cơ bản phía server bằng biến toàn cục giúp hạn chế truy vấn aggregate đắt đỏ.

### Service Layer (`src/services/advanced.service.ts`)
```typescript
import orderDetailModel from "../models/orderDetail.model";

export class CacheStatsService {
    private cacheStorage: any = {};    
    private expireLimit: number = 300_000;

    getTopSellingCached = async () => {
        const now = Date.now();
        
        // Trả kết quả từ biến nếu thỏa điều kiện bộ nhớ đệm
        if (this.cacheStorage["topSelling"] && this.cacheStorage["topSellingExpiry"] > now) {
            return this.cacheStorage["topSelling"]; 
        }

        const freshData = await orderDetailModel.aggregate([
            { $group: { _id: "$productID", totalSold: { $sum: "$quantity" } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);
        
        // Cập nhật giá trị biến
        this.cacheStorage["topSelling"] = freshData;
        this.cacheStorage["topSellingExpiry"] = now + this.expireLimit;

        return freshData;
    }
}
export default new CacheStatsService();
```

---

## 6. Bài 6: Phân Loại Truy Vấn Đa Điều Kiện ($or, $in, $gt)
Kết hợp nhiều biểu thức logic trong collection search (Tìm kết hợp theo keyword, danh sách category, số lượng dương).

### Service Layer (`src/services/advanced.service.ts`)
```typescript
import { FilterQuery } from "mongoose";
import productModel, { IProduct } from "../models/product.model";

export class SearchComplexService {
    searchMultiConditions = async (keyword: string, categoryIds: string[]) => {
        const filter: FilterQuery<IProduct> = {};

        if (keyword) {
            filter.$or = [
                { product_name: { $regex: keyword, $options: "i" } },
                { supplier: { $regex: keyword, $options: "i" } }
            ];
        }

        if (categoryIds && categoryIds.length > 0) {
            filter.categoryId = { $in: categoryIds }; 
        }

        filter.inventory_quantity = { $gt: 0 };

        const products = await productModel.find(filter)
                                           .populate("categoryId", "name")
                                           .sort("-createdAt")
                                           .lean();
        return products;
    }
}
export default new SearchComplexService();
```

---

## 7. Bài 7: Cảnh Báo Sản Phẩm Sắp Phải Bổ Sung Tồn Kho (Low Stock Alert API)
API query liệt kê các đối tượng dựa trên ngưỡng tồn định sẵn, sử dụng field selection và sort.

### Service Layer
```typescript
import productModel from "../models/product.model";

export class StockAlertService {
    getLowStockAlerts = async (threshold: number = 10) => {
        const lowStockProducts = await productModel.find({
            inventory_quantity: { $lte: threshold } 
        })
        .select("product_name inventory_quantity supplier") 
        .sort("inventory_quantity") 
        .lean();

        return {
            totalAlerts: lowStockProducts.length,
            products: lowStockProducts
        };
    }
}
export default new StockAlertService();
```

---

## 8. Bài 8: Tổng Quan Thống Kê Nhiều Node Dữ Liệu Đồng Thời (Dashboard Summary)
Gom tổng doanh thu qua `aggregate` ở root và lấy tổng đếm document. `Promise.all` được sử dụng để tối ưu thời gian thực thi của 3 câu lệnh riêng biệt chạy song song.

### Service Layer
```typescript
import orderModel from "../models/order.model";
import productModel from "../models/product.model";
import customerModel from "../models/customer.model";

export class DashboardService {
    getDashboardSummary = async () => {
        const [totalRevenueResult, totalProducts, totalCustomers] = await Promise.all([
            orderModel.aggregate([
                { $group: { _id: null, totalCostSum: { $sum: "$totalCost" }, billCount: { $sum: 1 } } }
            ]),
            productModel.countDocuments(),
            customerModel.countDocuments()
        ]);

        const orderStats = totalRevenueResult[0] || { totalCostSum: 0, billCount: 0 };

        return {
            success: true,
            data: {
                totalRevenue: orderStats.totalCostSum,
                totalOrders: orderStats.billCount,
                totalActiveProducts: totalProducts,
                totalSystemCustomers: totalCustomers
            }
        };
    }
}
export default new DashboardService();
```

---

## Hướng dẫn khai báo Router
```typescript
import { Router } from "express";
import advancedController from "../controllers/advanced.controller";

const router = Router();

router.get("/products/search", advancedController.advancedSearch);
// router.post("/orders/transaction", isAuthenticated, advancedController.createComplexOrder);
// router.get("/products/export/csv", advancedController.exportProductsCSV);

export default router;
```
