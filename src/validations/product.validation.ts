
import { z } from "zod";
import { optionalNumberQuery, paginationBaseSchema } from "./queryOptions.validation";


// Schema Product
export const productSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  price: z.number().nonnegative("Price must be >= 0"),
  quantity: z.number().int().nonnegative("Quantity must be >= 0"),
  inventory_quantity: z
    .number()
    .int()
    .nonnegative("Inventory quantity must be >= 0"),
  categoryId: z.string().length(24, "CategoryId must be 24 chars"),
  supplier: z.string().min(1, "Supplier is required"),
});

export const idParamsSchema = z.object({
  id: z.string({ message: "product id is required" }).length(24, {
    message: "product id must be a valid ObjectId (24 characters)",
  }),
});


export const productqueryschema = paginationBaseSchema.extend({
  search: z.string().optional().default(""),
  minPrice: optionalNumberQuery,
  maxPrice:optionalNumberQuery,
  minInventory:optionalNumberQuery,
  maxInventory:optionalNumberQuery,
}).strict("field not valid")

export type ProductQueryReq = z.infer<typeof productqueryschema>