import { z } from "zod"
import { paginationBaseSchema } from "./queryOptions.validation"

export const createCategorySchema = z.object({
  category_name: z
    .string({ message: "Category name is required" })
    .min(3, { message: "Category name must be at least 3 characters" }),

  description: z
    .string({ message: "Description must be a string" })
    .optional()
})

export const updateCategorySchema = createCategorySchema.partial().strict()

export const getCategoryQuerySchema = paginationBaseSchema.extend({
    search: z
    .string()
    .optional()
    .default("")
})

export type CreateCategoryReq = z.infer<typeof createCategorySchema>
export type UpdateCategoryReq = z.infer<typeof updateCategorySchema>
export type GetCategoryQueryReq = z.infer<typeof getCategoryQuerySchema>