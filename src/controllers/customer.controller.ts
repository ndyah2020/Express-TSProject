import { NextFunction, Request, Response } from "express";
import customerService from "../services/customer.service";
import { StatusCodes } from "http-status-codes";

export class CustomerController {
  get = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await customerService.get()
      res.status(StatusCodes.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  getById = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.params.id
      const result = await customerService.getById(customerId)

      res.status(StatusCodes.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  create = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const customer = req.body
      const result = await customerService.create(customer)

      res.status(StatusCodes.OK).json({
        message: "Create customer success",
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  update = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.params.id
      const customer = req.body
      const result = await customerService.update(customerId, customer)

      res.status(StatusCodes.OK).json({
        message: "Update customer success",
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  delete = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.params.id
      const result = await customerService.delete(customerId)

      res.status(StatusCodes.OK).json({
        message: "Delete customer success",
        data: result
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new CustomerController()