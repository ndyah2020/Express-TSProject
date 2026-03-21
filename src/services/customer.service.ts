import { Customer } from '../models/customer.model';
import { CustomerRes } from '../interfaces/customers.interface';
import { toCustomerRes } from '../mapper/customer.mapper';

export class CustomerService {
  getCustomers = async (page: number = 1, limit: number = 10): Promise<CustomerRes[]> => {
    const customers = await Customer.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
    return customers.map(toCustomerRes);
  };

  getCustomerById = async (id: string): Promise<CustomerRes | null> => {
    const customer = await Customer.findById(id).lean();
    return customer ? toCustomerRes(customer) : null;
  };

  createCustomer = async (customerData: Omit<CustomerRes, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomerRes> => {
    const customer = await Customer.create(customerData);
    return toCustomerRes(customer);
  };

  updateCustomer = async (id: string, customerData: Partial<Omit<CustomerRes, 'id' | 'createdAt' | 'updatedAt'>>): Promise<CustomerRes | null> => {
    const customer = await Customer.findByIdAndUpdate(
      id,
      customerData,
      { new: true, runValidators: true }
    ).lean();
    return customer ? toCustomerRes(customer) : null;
  };

  deleteCustomer = async (id: string): Promise<CustomerRes | null> => {
    const customer = await Customer.findByIdAndDelete(id).lean();
    return customer ? toCustomerRes(customer) : null;
  };
}

export default new CustomerService();