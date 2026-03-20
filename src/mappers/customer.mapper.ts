
import { CustomerRes } from "../interfaces/customers.interface";

export class CustomerMapper {
  static mapToResponse(customer: any): CustomerRes {
    return {
      id: customer._id?.toString() || '',
      name: customer.name || '',
      email: customer.email || '',
      address: customer.address || '',
      phone: customer.phone || '',
      createdAt: customer.createdAt || new Date(),
      updatedAt: customer.updatedAt || new Date(),
    };
  }

  static mapToResponses(customers: any[]): CustomerRes[] {
    return customers.map((c) => this.mapToResponse(c)) as CustomerRes[];
  }
}