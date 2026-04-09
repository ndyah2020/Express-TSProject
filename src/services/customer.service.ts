import { StatusCodes } from "http-status-codes";
import customerModel from "../models/customer.model";
import ApiError from "../utils/ApiError";
import {
  CreateCustomerReq,
  UpdateCustomerReq,
} from "../validations/customer.validation";
import { CustomerRes } from "../interfaces/customers.interface";
import { toCustomerRes } from "../mapper/customer.mapper";

export class CustomerService {
  get = async (): Promise<CustomerRes[]> => {
    const customer = await customerModel.find().lean();
    const customerRes: CustomerRes[] = customer.map((customers) =>
      toCustomerRes(customers),
    );
    return customerRes;
  };

  getById = async (customerID: string): Promise<CustomerRes> => {
    const customer = await customerModel.findById(customerID).lean();
    if (!customer)
      throw new ApiError(StatusCodes.NOT_FOUND, "Customer not found");
    return toCustomerRes(customer);
  };

  create = async (customer: CreateCustomerReq): Promise<CustomerRes> => {
    const newCustomer = await customerModel.create(customer);

    if (!newCustomer)
      throw new ApiError(StatusCodes.BAD_REQUEST, "Create customer failed");

    return toCustomerRes(newCustomer);
  };

  update = async (
    customerID: string,
    customer: Partial<UpdateCustomerReq>,
  ): Promise<CustomerRes> => {
    const newCustomer = await customerModel
      .findByIdAndUpdate(customerID, customer, { new: true })
      .lean();
    
    if (!newCustomer)
      throw new ApiError(StatusCodes.NOT_FOUND, "Customer not found");

    return toCustomerRes(newCustomer);
  };

  delete = async (customerID: string): Promise<CustomerRes> => {
    const deletedCustomer = await customerModel
      .findByIdAndDelete(customerID)
      .lean();

    if (!deletedCustomer)
      throw new ApiError(StatusCodes.NOT_FOUND, "Customer not found");

    return toCustomerRes(deletedCustomer);
  };
}

export default new CustomerService();