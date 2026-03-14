import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customer.service';

export class CustomerController {
  private customerService: CustomerService;
  constructor() {
    this.customerService = new CustomerService();
  }
  getCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit } = req.query as { page?: number; limit?: number };
      const customers = await this.customerService.getCustomers(page, limit);
      res.status(200).json({
        success: true,
        data: customers,
        page: page || 1,
        limit: limit || 10
      });
    } catch (error) {
      next(error);
    }
  }
  createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerData = req.body;
      const customer = await this.customerService.createCustomer(customerData);
      res.status(201).json({
        success: true,
        data: customer,
        message: "Khách hàng đã được tạo thành công"
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
        res.status(404).json({
          success: false,
          message: "Không tìm thấy khách hàng"
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: customer,
        message: "Khách hàng đã được xóa thành công"
      });
    } catch (error) {
      next(error);
    }
  }
  updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const customerdata = req.body;
      const customer = await this.customerService.updateCustomer(id, customerdata);
      if (!customer) {
        res.status(404).json({
          success: false,
          message: "không tìm thấy khách hàng"
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: customer
      });
    } catch (error) {
      next(error);
    }
  }
}
export default new CustomerController();