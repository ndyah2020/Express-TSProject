import { z } from "zod"

export const createCategorySchema = z.object({
  category_name: z
    .string({ message: "Category name is required" })
    .min(3, { message: "Category name must be at least 3 characters" }),

  description: z
    .string({ message: "Description must be a string" })
    .optional()
})

export const updateCategorySchema = createCategorySchema.partial()

export const idParamsSchema = z.object({
  id: z
    .string({ message: "Category id is required" })
    .length(24, { message: "Category id must be a valid ObjectId (24 characters)" })
})

export type CreateCategoryReq = z.infer<typeof createCategorySchema>
export type UpdateCategoryReq = z.infer<typeof updateCategorySchema>