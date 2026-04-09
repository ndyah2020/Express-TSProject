import { z } from "zod"

export const createCustomerSchema = z.object({
  name: z
    .string({ message: "Customer name is required" })
    .min(2, { message: "Customer name must be at least 2 characters" }),

  email: z
    .string({ message: "Email is required" })
    .email({ message: "Email must be valid" }),

  phone: z
    .string({ message: "Phone is required" })
    .regex(/^[0-9]{10,11}$/, { message: "Phone must be 10-11 digits" }),

  address: z
    .string({ message: "Address is required" })
    .min(5, { message: "Address must be at least 5 characters" })
})

export const updateCustomerSchema = createCustomerSchema.partial()

export const idParamsSchema = z.object({
  id: z
    .string({ message: "Customer id is required" })
    .length(24, { message: "Customer id must be a valid ObjectId (24 characters)" })
})

export type CreateCustomerReq = z.infer<typeof createCustomerSchema>
export type UpdateCustomerReq = z.infer<typeof updateCustomerSchema>