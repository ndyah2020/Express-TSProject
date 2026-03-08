import { z } from "zod"

export const createCategorySchema = z.object({
  category_name: z
    .string({ message: "Category name is required" })
    .min(3, { message: "Category name must be at least 3 characters" }),

  description: z
    .string({ message: "Description must be a string" })
    .optional()
})

export const updateCategorySchema = z.object({
  category_name: z
    .string({ message: "Category name must be a string" })
    .min(3, { message: "Category name must be at least 3 characters" })
    .optional(),
  description: z
    .string({ message: "Description must be a string" })
    .optional()
})

export const idParamsSchema = z.object({
  id: z
    .string({ message: "Category id is required" })
    .length(24, { message: "Category id must be a valid ObjectId (24 characters)" })
})