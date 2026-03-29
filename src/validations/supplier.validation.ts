import z from "zod"
import { paginationBaseSchema } from "./pagination.validation"


export const getSupplierQuerySchema = paginationBaseSchema.extend({
    search: z
    .string()
    .optional()
    .default("")
})

export const createSupplierSchema = z.object({
    supplier_name: z.string({ message: "Supplier name is required" }).min(3, { message: "Supplier name must be at least 3 characters" }),
    phone_number: z.string({message: "Phone number is required"}).regex(/^\d{10}/, "Phone number must have 10 digits."),
    address: z.string({message: "Phone number is required"})
})

export const updateSupplierSchema = createSupplierSchema.partial()

export type CreateSupplierReq = z.infer<typeof createSupplierSchema>
export type UpdateSupplierReq = z.infer<typeof updateSupplierSchema>
export type GetSupplierQueryReq = z.infer<typeof getSupplierQuerySchema>