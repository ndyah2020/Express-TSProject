import z from "zod";
import { paginationBaseSchema } from "./pagination.validation";



export const createInventoryReceiptSchema = z.object({
    supplierId:z.string({message: "Supplier ID must be string"})
                .length(24, {message: "Customer ID must be a valid ObjectId (24 characters)"}),

    import_date: z.preprocess((val) => {
        if (!val || val === "") return undefined
        return new Date(val as string)
    }, z.date()).default(() => new Date()),

    products: z.array(
        z.object({
            productId:z.string({message: "ProductId must be string"})
                        .length(24, {message: "Customer ID must be a valid ObjectId (24 characters)"}),

            import_price:z.number({message: "import price must be number"}).default(0)
                            .refine(val => val > 0, {message: "Import price must be greater than 0 "}),

            quality:z.number({message: "import price must be number"}).default(0)
                            .refine(val => val > 0, {message: "Quality must be greater than 0"}),
        })
    )
})

export const getInventoryReceiptQuerySchema = paginationBaseSchema.extend({
    minPrice: z.string().transform(val => Number(val)).optional(),
    maxPrice: z.string().transform(val => Number(val)).optional()
})


export type CreateInventoryReceiptReq = z.infer<typeof createInventoryReceiptSchema>
export type GetInventoryReceiptQueryReq = z.infer<typeof getInventoryReceiptQuerySchema>