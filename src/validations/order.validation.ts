import { z } from "zod";

// validation: tạo hóa đơn mới
export const createOrderSchema = z.object({
  customerID: z
    .number({ message: "Customer ID must be a number" })
    .int({ message: "Customer ID must be an integer" }),

  sellerID: z
    .number({ message: "Seller ID must be a number" })
    .int({ message: "Seller ID must be an integer" }),

  totalCost: z
    .number({ message: "Total cost must be a number" })
    .positive({ message: "Total cost must be greater than 0" }),

  paymentMethod: z
    .string({ message: "Payment method is required" })
    .min(1, { message: "Payment method cannot be empty" }),
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
    .coerce.number({ message: "Customer ID must be a number" })
    .int({ message: "Customer ID must be an integer" })
    .min(1, { message: "Customer ID must be a positive integer" }),
});

// validation: lấy hóa đơn theo id người bán
export const sellerIdParamsSchema = z.object({
  sellerId: z
    .coerce.number({ message: "Seller ID must be a number" })
    .int({ message: "Seller ID must be an integer" })
    .min(1, { message: "Seller ID must be a positive integer" }),
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
