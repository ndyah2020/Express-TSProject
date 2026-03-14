import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import orderService from "../services/order.service";

export class OrderController {
  get = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await orderService.get();
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.params.id;
      const result = await orderService.getById(orderId);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderBody = req.body;
      const result = await orderService.create(orderBody);
      res.status(StatusCodes.CREATED).json({
        message: "Create order success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new OrderController();
