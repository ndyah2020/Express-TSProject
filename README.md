# Tổng Hợp Chi Tiết Các Bài Tập Nâng Cao (Express - TypeScript - Mongoose)

Chào bạn, theo yêu cầu, đây là tài liệu hướng dẫn **CHI TIẾT TOÀN BỘ CODE** các bài tập phát triển tính năng nâng cao dùng cho bài kiểm tra ngày mai. 

> ⚠️ **Lưu ý quan trọng**: Toàn bộ code trong file này được thiết kế chuẩn mô hình **MVC** của Express-TypeScript. Trong mỗi bài tập đều chỉ rõ đoạn code này đặt ở file nào, đi kèm Validation và Middleware nào để đạt chuẩn tuyệt đối. Trình tự đọc nên theo: `Validation -> Middleware -> Service -> Controller -> Route`.

---

## 1. Bài Tập 1: Tìm Kiếm Nâng Cao Đa Tiêu Chí Động (Advanced Filtering & Pagination)
*Đề bài: Xây dựng API lấy dánh sách sản phẩm với các filter động như tìm theo tên (chứa đoạn text), tìm theo khoảng giá (min - max), theo ID danh mục, và kết hợp Middleware Phân trang.*

### A. Validation File (`src/validations/product.validation.ts`)
*Mô tả: Sử dụng thư viện `zod` để validate tham số truy vấn tìm kiếm từ người dùng, tránh lỗi hệ thống khi giá trị đầu vào sai kiểu.*
```typescript
import { z } from "zod";

export const advancedSearchSchema = z.object({
  query: z.object({
    keyword: z.string().optional(),
    minPrice: z.string().regex(/^\d+$/).optional().transform(Number),
    maxPrice: z.string().regex(/^\d+$/).optional().transform(Number),
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Trường categoryId phải là một ObjectID hợp lệ").optional(),
    sortBy: z.enum(["price", "createdAt", "product_name"]).default("createdAt"),
    order: z.enum(["asc", "desc"]).default("desc"),
    page: z.string().regex(/^\d+$/).default("1").transform(Number), // Thêm phân trang
    limit: z.string().regex(/^\d+$/).default("10").transform(Number), 
  }),
});
```

### B. Service Logic (`src/services/product.service.ts`)
*Mô tả: Logic tạo query object linh hoạt và truy vấn cơ sở dữ liệu.*
```typescript
import Product from "../models/product.model";

export class ProductService {
  async advancedProductSearch(filters: any) {
    const { keyword, minPrice, maxPrice, categoryId, sortBy, order, page, limit } = filters;
    const query: any = {};

    // 1. Lọc theo tên sản phẩm (Regex không phân biệt hoa thường)
    if (keyword) {
      query.product_name = { $regex: keyword, $options: "i" };
    }

    // 2. Lọc theo mức giá $gte (lớn hơn hoặc bằng), $lte (nhỏ hơn hoặc bằng)
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    // 3. Lọc theo danh mục
    if (categoryId) {
      query.categoryId = categoryId;
    }

    // 4. Thuật toán Sắp xếp Sort
    const sortConfig: any = {};
    sortConfig[sortBy] = order === 'desc' ? -1 : 1;

    // 5. Tính toán phân trang
    const skip = (page - 1) * limit;

    // 6. Thực thi tìm kiếm
    const products = await Product.find(query)
                                  .sort(sortConfig)
                                  .skip(skip)
                                  .limit(limit)
                                  .populate("categoryId", "name") // Join lấy thêm tên danh mục
                                  .lean(); // Tối ưu tốc độ parse
    
    // Đếm tổng số để trả về cho Front-End phân trang
    const totalCount = await Product.countDocuments(query);

    return {
      data: products,
      pagination: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      }
    };
  }
}
export default new ProductService();
```

### C. Controller Layer (`src/controllers/product.controller.ts`)
*Mô tả: Nhận dữ liệu đã qua xử lý (validate query) và gọi sang service, format lại chuẩn JSON trả về*
```typescript
import { Request, Response, NextFunction } from "express";
import ProductService from "../services/product.service";
import { StatusCodes } from "http-status-codes";

export class ProductController {
  advancedSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = req.query; // Query này đã được Zod xác nhận an toàn bởi Middleware
      const result = await ProductService.advancedProductSearch(filters);
      
      res.status(StatusCodes.OK).json({
        success: true,
        message: "Tìm kiếm sản phẩm thành công",
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  };
}
export default new ProductController();
```

### D. Router Layer (`src/routes/product.route.ts`)
*Mô tả: Gắn chung hàm Validate (Middleware phân tích Schema Zod), Middleware Verify (Xác thực xem có phải Admin/User thật không), sau đó gọi tới Controller.*
```typescript
import { Router } from "express";
import ProductController from "../controllers/product.controller";
import { validateRequest } from "../middlewares/validateRequest.middleware"; 
import { isAuthenticated } from "../middlewares/auth.middleware"; 
import { advancedSearchSchema } from "../validations/product.validation";

const router = Router();

// Endpoint: GET /products/search
// 1. Qua Middleware isAuthenticated: kiểm tra Token
// 2. Qua Middleware validateRequest: quét schema query parameter an toàn mới chạy tiếp
// 3. Controller xử lý
router.get(
  "/search",
  isAuthenticated,                         // Middleware: Đăng nhập mới được dùng chức năng nội bộ (Nâng cao)
  validateRequest(advancedSearchSchema),   // Middleware: Chặn các Parameter bậy từ user
  ProductController.advancedSearch
);

export default router;
```

---

## 2. Bài Tập 2: Thống Kê Bằng Aggregation (Sản phẩm bán chạy & Doanh Thu)
*Đề bài tính logic kinh doanh mạnh mẽ: Xử lý nhóm bản ghi lớn dựa vào pipeline của MongoDB (`$group, $match, $lookup, $unwind`).*

### A. Service Logic (`src/services/report.service.ts`)
*Mô tả: Hãy tách file thống kê thành 1 Service riêng để quản lý, không để lẫn sang OrderService hay ProductService.*
```typescript
import OrderDetail from "../models/orderDetail.model";
import Order from "../models/order.model";

export class ReportService {
  /**
   * Tính doanh thu theo từng tháng của 1 năm cụ thể
   */
  async getMonthlyRevenue(year: number) {
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const result = await Order.aggregate([
      // Bước 1: Lấy các hoá đơn nằm trong năm nay
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      // Bước 2: Gom nhóm theo tháng (Dùng toán tử $month móc số tháng từ ngày tạo)
      {
        $group: {
          _id: { $month: "$createdAt" },       // Gom theo số tháng (1 -> 12)
          totalRevenue: { $sum: "$totalCost" },// Cộng dồn toàn bộ cột tổng tiền ($totalCost)
          totalOrders: { $sum: 1 }             // Đếm có bao nhiêu dòng trùng tháng (Số đơn)
        }
      },
      // Bước 3: Sắp xếp kết quả tháng từ 1 tới 12 ngẫu nhiên từ Aggregation
      { $sort: { "_id": 1 } },
      // Bước 4: Chắp lại tên field cho đẹp khi gửi JSON (Ẩn _id, đổi thành month)
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

  /**
   * Truy xuất những mặt hàng bán chạy nhất (JOIN 2 COLLECTION)
   */
  async getTopSellingProducts(limit: number = 5) {
    const topProducts = await OrderDetail.aggregate([
      // Bước 1: Gom các dòng cùng 1 loại sản phẩm lại, cộng các lượng bán.
      {
        $group: {
          _id: "$productID", // ObjectId của Product
          totalSoldQuantity: { $sum: "$quantity" },
          totalRevenueGenerated: { $sum: "$totalPrice" }
        }
      },
      // Bước 2: Lọc sản phẩm bán được nhiều nhất lên đầu
      { $sort: { totalSoldQuantity: -1 } },
      // Bước 3: Chỉ lấy TOP (giới hạn)
      { $limit: limit },
      // Bước 4: Lookup (Hoạt động như lệnh JOIN trong SQL) sang bảng Product để móc Tên Sản Phẩm ra
      {
        $lookup: {
          from: "products",         // Tên Collection thực tế trong DB thường là dạng số nhiều tiếng Anh thường
          localField: "_id",        // Field của collection OrderDetail (_id ở dòng group ngay phía trên)
          foreignField: "_id",      // Field gốc bên bảng Products
          as: "productDetails"      // Tên cục chứa mảng hứng về
        }
      },
      // Bước 5: Mảng productDetails có 1 phần tử nên cần bung nó ra (Unwind) thành Object
      { $unwind: "$productDetails" },
      // Bước 6: Loại bỏ dữ liệu thừa, chỉ lấy cái cần return cho Frontend
      {
        $project: {
          _id: 0,
          productID: "$_id",
          totalSoldQuantity: 1,
          totalRevenueGenerated: 1,
          productName: "$productDetails.product_name",
          supplier: "$productDetails.supplier"
        }
      }
    ]);

    return topProducts;
  }
}
export default new ReportService();
```

### B. Controller Layer (`src/controllers/report.controller.ts`)
```typescript
import { Request, Response, NextFunction } from "express";
import ReportService from "../services/report.service";
import { StatusCodes } from "http-status-codes";

export class ReportController {
  getMonthlyRevenue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate đơn giản trực tiếp trong controller nếu không ghi logic quá sâu bằng Zod
      const year = parseInt(req.query.year as string);
      if (isNaN(year) || year < 2000) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Year invalid" });
      }

      const report = await ReportService.getMonthlyRevenue(year);
      res.status(StatusCodes.OK).json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  };

  getTopSellingProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const report = await ReportService.getTopSellingProducts(limit);

      res.status(StatusCodes.OK).json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  };
}
export default new ReportController();
```

### C. Router Layer (`src/routes/report.route.ts`)
```typescript
import { Router } from "express";
import ReportController from "../controllers/report.controller";
import { isAdmin } from "../middlewares/auth.middleware"; // Giả sử ta có middleware chặn chỉ có quyền admin mới xem được báo cáo

const router = Router();

// GET /reports/revenue?year=2023
router.get(
  "/revenue", 
  isAdmin, // Middleware phân quyền (Rất quan trọng đối với các loại tài liệu báo cáo)
  ReportController.getMonthlyRevenue
);

// GET /reports/top-selling?limit=10
router.get(
  "/top-selling", 
  isAdmin, 
  ReportController.getTopSellingProducts
);

export default router;
```

---

## 3. Bài Tập 3: Tạo Order Phức Tạp Sử Dụng Session Transactions (ACID)
*Một kỹ thuật nâng cao bậc nhất chứng tỏ hiểu rõ Database: Việc tạo 1 hệ thống Order sẽ đụng đến 3 hành động:* 
*1. Trừ bớt Inventory Quantity của Product* 
*2. Insert bảng Order mới*
*3. Insert mảng dữ liệu vào OrderDetail.* 
*Giao dịch (Transaction) sẽ cuộn tất cả ở 1 session, nếu bất kì hành động 1, 2, 3 nào bị lỗi (chết nguồn, lỗi code, lỗi khoang chứa), hệ thống tự Rollback xoay lùi toàn bộ, không gây hư liệu cục bộ.*

### A. Service Logic (`src/services/order.service.ts`)
```typescript
import mongoose from "mongoose";
import Order from "../models/order.model";
import OrderDetail from "../models/orderDetail.model";
import Product from "../models/product.model";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";

export class OrderService {
  async processComplexOrder(customerID: string, sellerID: string, paymentMethod: string, items: {productID: string, quantity: number}[]) {
    
    // Yếu tố làm nên ACID Database của MongoDB chính là lệnh này
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let totalOrderCost = 0;
      const parsedDetails = [];

      // Vòng lặp từng danh mục order
      for (const item of items) {
        // [CỰC KỲ CHI TIẾT]: Fetch bản ghi và bắt buộc nối với .session(session) !!!
        const product = await Product.findById(item.productID).session(session);

        if (!product) {
          throw new ApiError(StatusCodes.NOT_FOUND, `Sản phẩm ${item.productID} không tồn tại`);
        }
        if (product.inventory_quantity < item.quantity) {
          throw new ApiError(StatusCodes.BAD_REQUEST, `Kho hàng không đủ đối với mặt hàng '${product.product_name}'`);
        }

        // 1. Tiến hành Trừ Kho Hàng và lưu cùng phiên thay đổi session
        product.inventory_quantity -= item.quantity;
        await product.save({ session });
        
        const subTotalPrice = product.price * item.quantity;
        totalOrderCost += subTotalPrice;

        parsedDetails.push({
          productID: product._id,
          quantity: item.quantity,
          price: product.price,
          totalPrice: subTotalPrice
        });
      }

      // 2. Tạo Master Record Order
      const newOrder = await Order.create([{
        customerID,
        sellerID,
        totalCost: totalOrderCost,
        paymentMethod
      }], { session }); // Mảng [0] vì create trả ra 1 mảng nếu gắn Array

      const orderId = newOrder[0]._id;

      // Chuẩn bị đính kèm khóa ngoại của bảng mẹ (Order) cho dòng con
      const finalOrderDetails = parsedDetails.map(d => ({ ...d, orderID: orderId }));

      // 3. Tạo List OrderDetails (Insert nhiều cái cùng lúc)
      await OrderDetail.insertMany(finalOrderDetails, { session });

      // ======================================
      // NẾU CODE CHẠY ĐƯỢC TỚI ĐÂY MÀ KHÔNG GÂY LỖI, THÌ MỚI LƯU CỨNG VÀO MEMORY CỦA MÁY CHỦ BẰNG COMMIT TỨC KHẮC
      // ======================================
      await session.commitTransaction();
      session.endSession();

      return newOrder[0];

    } catch (error) {
      // 🚨 CỨU DỮ LIỆU: Bị lỗi => Xoay lùi, huỷ các thay đổi (Kể cả cái hàm save hay insert ở bên trên cũng bay màu khôi phục nguyên trạng)
      await session.abortTransaction();
      session.endSession();
      throw error; 
    }
  }
}
export default new OrderService();
```

### B. Controller Logic (`src/controllers/order.controller.ts`)
```typescript
import { Request, Response, NextFunction } from "express";
import OrderService from "../services/order.service";
import { StatusCodes } from "http-status-codes";

export class OrderController {
  createComplexOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customerID, sellerID, paymentMethod, items } = req.body;
      const order = await OrderService.processComplexOrder(customerID, sellerID, paymentMethod, items);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Phiên giao dịch tạo Order xuất sắc được hoàn tất an toàn qua Transaction",
        data: order
      });
    } catch (error) {
      next(error); 
    }
  }
}
export default new OrderController();
```
*(Validation cho Order bạn có thể define bằng Zod Schema `z.array(z.object({ productID..., quantity: ... }))` và nhúng thành Middleware).*

---
Chúc bạn qua bài kiểm tra ngày mai thật thành công và thuận lợi! 🚀
