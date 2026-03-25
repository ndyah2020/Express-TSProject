import {z} from "zod"
export const createSupplierShema =z.object({
 supplier_name:z
 .string({ message:" LÔI RỒI"})
 .min(3, {message:" heheh"}),

 const_person:z
 .string({ message:" lôi"})
    .min(2,{message: " lôi rồi "}),

email:z
.string({message:"loi"})
.min(1,{message:"tran hoai bao"})
 
 
})
export const updateSupplierShema =createSupplierShema.partial()
