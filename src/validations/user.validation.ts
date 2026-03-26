import z from "zod"
import { paginationBaseSchema } from "./pagination.validation"

export const userQuerySchema = paginationBaseSchema.extend({
    search: z
    .string()
    .optional()
    .default("")
})

export type IUserQueryReq = z.infer<typeof userQuerySchema>