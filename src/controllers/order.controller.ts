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
      const { id } = req.params; 
      const result = await orderService.getById(id);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    } 
  };
  
  getByCustomerId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = Number(req.params.customerId);
      const result = await orderService.getByCustomerId(customerId);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  getBySellerId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sellerId = Number(req.params.sellerId);
      const result = await orderService.getBySellerId(sellerId);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  getByTimeRange = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.body; 
      const start = new Date(startDate);
      const end = new Date(endDate);
      const result = await orderService.getByTimeRange(start, end);
      res.status(StatusCodes.OK).json(result);
    }
      catch (error) {
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
