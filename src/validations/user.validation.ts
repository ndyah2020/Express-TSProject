import z from "zod"
import { paginationBaseSchema } from "./pagination.validation"

export const getUserQuerySchema = paginationBaseSchema.extend({
    search: z
    .string()
    .optional()
    .default("")
})

export type GetUserQueryReq = z.infer<typeof getUserQuerySchema>