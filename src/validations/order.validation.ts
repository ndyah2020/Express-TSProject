import { z } from "zod";

// validation: tạo hóa đơn mới
export const createOrderSchema = z.object({
  customerID: z
    .string({ message: "Customer ID must be a string" })
    .length(24, {
      message: "Customer ID must be a valid ObjectId (24 characters)",
    }),

  sellerID: z
    .string({ message: "Seller ID must be a string" })
    .length(24, {
      message: "Seller ID must be a valid ObjectId (24 characters)",
    }),

  totalCost: z
    .number({ message: "Total cost must be a number" })
    .positive({ message: "Total cost must be greater than 0" }),

  paymentMethod: z
    .string({ message: "Payment method is required" })
    .min(1, { message: "Payment method cannot be empty" }),
  details: z.array(z.object({
    productID: z
      .string({ message: "Product ID must be a string" })
      .length(24, {
        message: "Product ID must be a valid ObjectId (24 characters)",
      }),
    quantity: z
      .number({ message: "Order quantity must be a number" })
      .positive({ message: "Order quantity must be greater than 0" }),
    price: z
      .number({ message: "Price must be a number" })
      .positive({ message: "Price must be greater than 0" }),
    totalPrice: z
      .number({ message: "Total price must be a number" })
      .positive({ message: "Total price must be greater than 0" }),
  })),
});

// validation: lấy hóa đơn theo id hóa đơn
export const idParamsSchema = z.object({
  id: z
    .string({ message: "Order id is required" })
    .length(24, {
      message: "Order id must be a valid ObjectId (24 characters)",
    }),
});

// validation: lấy hóa đơn theo id khách hàng
export const customerIdParamsSchema = z.object({
  customerId: z
    .string({ message: "Customer ID must be a string" })
    .length(24, {
      message: "Customer ID must be a valid ObjectId (24 characters)",
    }),
});

// validation: lấy hóa đơn theo id người bán
export const sellerIdParamsSchema = z.object({
  sellerId: z
    .string({ message: "Seller ID must be a string" })
    .length(24, {
      message: "Seller ID must be a valid ObjectId (24 characters)",
    }),
});

// validation: lấy hóa đơn theo khoảng thời gian
export const timeRangeParamsSchema = z
  .object({
    startDate: z.string().datetime({ message: "Invalid start date" }),
    endDate: z.string().datetime({ message: "Invalid end date" }),
  })
  .refine(
    ({ startDate, endDate }) => new Date(startDate) <= new Date(endDate),
    {
      message: "startDate cannot be greater than endDate",
      path: ["startDate"],
    },
  );

export type CreateOrderReq = z.infer<typeof createOrderSchema>;
