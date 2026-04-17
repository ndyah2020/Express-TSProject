import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

interface ValidateSchema {
  body?: ZodSchema ;
  query?: ZodSchema ;
  params?: ZodSchema ;
}

export const validate = (schema: ValidateSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }

      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }

      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

