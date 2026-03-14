import { Customer, ICustomer } from '../models/customer.model';
import { Icustomer } from '../interfaces/customers.interface';
export class CustomerService {
  async getCustomers(page: number = 1, limit: number = 10): Promise<ICustomer[]> {
    const skip = (page - 1) * limit;
    const customers = await Customer.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return customers;
  }
  async createCustomer(customerData: Icustomer): Promise<ICustomer> {
    const customer = await Customer.create(customerData);
    return customer;
  }
  async updateCustomer(id: string, customerData: Partial<Icustomer>): Promise<ICustomer | null> {
    const customer = await Customer.findByIdAndUpdate(
      id,
      customerData,
      { new: true, runValidators: true }
    );
    return customer;
  }
  async deleteCustomer(id: string): Promise<ICustomer | null> {
    const customer = await Customer.findByIdAndDelete(id);
    return customer;
  }
}
export default new CustomerService();