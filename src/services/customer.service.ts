import { Customer } from '../models/customer.model';
import { CustomerRes } from '../interfaces/customers.interface';
import { CustomerMapper } from '../mappers/customer.mapper';

export class CustomerService {
  async getCustomers(page: number = 1, limit: number = 10): Promise<CustomerRes[]> {
    const skip = (page - 1) * limit;
    const customers = await Customer.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
    return CustomerMapper.mapToResponses(customers);
  }
  async getCustomerById(id: string): Promise<CustomerRes | null> {
    const customer = await Customer.findById(id).lean();
    return customer ? CustomerMapper.mapToResponse(customer) : null;
  }
  async createCustomer(customerData: Omit<CustomerRes, 'id'>): Promise<CustomerRes> {
    const customer = await Customer.create(customerData);
    return CustomerMapper.mapToResponse(customer);
  }

  async updateCustomer(id: string, customerData: Partial<Omit<CustomerRes, 'id'>>): Promise<CustomerRes | null> {
    const customer = await Customer.findByIdAndUpdate(
      id,
      customerData,
      { new: true, runValidators: true }
    ).lean();
    return customer ? CustomerMapper.mapToResponse(customer) : null;
  }

  async deleteCustomer(id: string): Promise<CustomerRes | null> {
    const customer = await Customer.findByIdAndDelete(id).lean();
    return customer ? CustomerMapper.mapToResponse(customer) : null;
  }
}
export default new CustomerService();