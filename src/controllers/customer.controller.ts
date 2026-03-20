import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customer.service';
import { StatusCodes } from 'http-status-codes';

const { OK, CREATED, NOT_FOUND } = StatusCodes;

export class CustomerController {
  private customerService: CustomerService;
  constructor() {
    this.customerService = new CustomerService();
  }
  getCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const customers = await this.customerService.getCustomers(page, limit);
    
    res.status(OK).json({
      success: true,
      data: customers,
      message: "Lấy danh sách khách hàng thành công"
    });
  } catch (error) {
    next(error);
  }
}
  getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const customer = await this.customerService.getCustomerById(id);
      if (!customer) {
        res.status(NOT_FOUND).json({
          success: false,
          message: "Không tìm thấy khách hàng"
        });
        return;
      }
      res.status(OK).json({
        success: true,
        data: customer,
        message: "Lấy thông tin khách hàng thành công"
      });
    } catch (error) {
      next(error);
    }
  }
  createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerData = req.body;
      const customer = await this.customerService.createCustomer(customerData);
      res.status(CREATED).json({
        success: true,
        data: customer,
        message: "Tạo khách hàng thành công"
      });
    } catch (error) {
      next(error);
    }
  }
  updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const customerData = req.body;
      const customer = await this.customerService.updateCustomer(id, customerData);
      if (!customer) {
        res.status(NOT_FOUND).json({
          success: false,
          message: "Không tìm thấy khách hàng"
        });
        return;
      }
      res.status(OK).json({
        success: true,
        data: customer,
        message: "Cập nhật khách hàng thành công"
      });
    } catch (error) {
      next(error);
    }
  }
  deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const customer = await this.customerService.deleteCustomer(id);
      if (!customer) {
        res.status(NOT_FOUND).json({
          success: false,
          message: "Không tìm thấy khách hàng"
        });
        return;
      }
      res.status(OK).json({
        success: true,
        data: customer,
        message: "Xóa khách hàng thành công"
      });
    } catch (error) {
      next(error);
    }
  }
}
export default new CustomerController();