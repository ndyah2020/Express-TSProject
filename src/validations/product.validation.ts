import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

// Schema Product
export const productSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  price: z.number().nonnegative("Price must be >= 0"),
  quantity: z.number().int().nonnegative("Quantity must be >= 0"),
  inventory_quantity: z.number().int().nonnegative("Inventory quantity must be >= 0"),
  categoryId: z.string().length(24, "CategoryId must be 24 chars"),
  supplier: z.string().min(1, "Supplier is required"),
});


export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  try {
    productSchema.parse(req.body); 
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = error.errors.map((e) => e.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Validation failed",
        errors: messages,
      });
    }
    next(error);
  }
};