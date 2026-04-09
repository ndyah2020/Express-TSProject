import {z} from "zod"

export const paginationBaseSchema = z.object({
    page: z
        .string()
        .optional()
        .default("1")
        .transform((val) => Number(val))
        .refine((val) => val > 0, {
            message: "Page must be > 0"
        }),
    limit: z
        .string()
        .optional()
        .default("10")
        .transform((val) => Number(val))
        .refine((val) => val > 0 && val < 100, {
            message: "Limit must be between 1 and 100"
        }),
    sort: z
        .string()
        .optional()
        .default("-createdAt")
        .refine((val) => val.length > 0, {
            message: "sort must be name's field and not null"
        })
})

export type PaginationBase = z.infer<typeof paginationBaseSchema>

