
import { CustomerRes } from "../interfaces/customers.interface";

export class CustomerMapper {
  static mapToResponse({
    _id,
    name,
    email,
    address,
    phone,
    createdAt,
    updatedAt,
  }: any): CustomerRes {
    return {
      id: _id?.toString(),
      name,
      email,
      address,
      phone,
      createdAt,
      updatedAt,
    };
  }

  static mapToResponses(customers: any[]): CustomerRes[] {
    return customers.map((c) => this.mapToResponse(c));
  }
}