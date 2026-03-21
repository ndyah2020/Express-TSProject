import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import customerService from "../services/customer.service";

export class CustomerController {
  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await customerService.getCustomers(page, limit);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await customerService.getCustomerById(id);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerBody = req.body;
      const result = await customerService.createCustomer(customerBody);
      res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const customerBody = req.body;
      const result = await customerService.updateCustomer(id, customerBody);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await customerService.deleteCustomer(id);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}

const customerController = new CustomerController();
export default customerController;