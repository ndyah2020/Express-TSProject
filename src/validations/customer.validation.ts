import { z } from 'zod';
export const createCustomerSchema = z.object({
  name: z.string({ message: " tên bị sai " }),
  email: z.string().email({ message: "email sai rồi" }),
  phone: z.string({ message: "sdt sai luôn" }),
  address: z.string({ message: "địa chỉ bị sai nhé bạn ơi " })
});
export const getCustomersQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10)
});
export const updateCustomerSchema = z.object({
  name: z.string({ message: "ten sai" }).optional(),
  email: z.string({ message: "email sai" }).optional(),
  phone: z.string({ message: "sdt sai" }).optional(),
  address: z.string({ message: "dia chi sai" }).optional()

});
export const customerIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "ID không hợp lệ" })
});