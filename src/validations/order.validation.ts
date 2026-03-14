import { z } from "zod";

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

