import { StatusCodes } from "http-status-codes";
import orderModel, { IOrder } from "../models/order.model";
import ApiError from "../utils/ApiError";

export class OrderService {
  get = async (): Promise<IOrder[]> => {
    const orders = await orderModel.find();
    if (!orders.length)
      throw new ApiError(StatusCodes.NOT_FOUND, "No orders found");
    return orders;
  };

  getById = async (orderID: string): Promise<IOrder> => {
    const foundOrder = await orderModel.findById(orderID);
    if (!foundOrder)
      throw new ApiError(StatusCodes.NOT_FOUND, "Order not found");
    return foundOrder;
  };

  create = async (orderBody: Partial<IOrder>): Promise<IOrder> => {
    const newOrder = await orderModel.create(orderBody);
    if (!newOrder)
      throw new ApiError(StatusCodes.BAD_REQUEST, "Create order failed");
    return newOrder;
  };
}

export default new OrderService();
