// src/mappers/customer.mapper.ts
import { ICustomer } from "../models/customer.model";
import { CustomerRes } from "../interfaces/customers.interface";

export class CustomerMapper {
  static mapToResponse(customer: any): CustomerRes {
    return {
      id: customer._id?.toString() || customer.id,
      name: customer.name,
      email: customer.email,
      address: customer.address,
      phone: customer.phone,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  static mapToResponses(customers: any[]): CustomerRes[] {
    return customers.map(c => this.mapToResponse(c));
  }
}