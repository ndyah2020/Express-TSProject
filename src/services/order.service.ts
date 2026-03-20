import { StatusCodes } from "http-status-codes";
import orderModel from "../models/order.model";
import ApiError from "../utils/ApiError";
import { CreateOrderReq } from "../validations/order.validation";
import { toOrderRes } from "../mapper/order.mapper";
import { OrderRes } from "../interfaces/order.interface";

export class OrderService {
  get = async (): Promise<OrderRes[]> => {
    const orders = await orderModel.find();
    if (!orders.length)
      throw new ApiError(StatusCodes.NOT_FOUND, "No orders found");
    return orders.map(toOrderRes);
  };

  getById = async (orderId: string): Promise<OrderRes> => {
    const order = await orderModel.findById(orderId);
    if (!order) throw new ApiError(StatusCodes.NOT_FOUND, "Order not found");
    return toOrderRes(order);
  };

  getByCustomerId = async (customerId: number): Promise<OrderRes[]> => {
    const orders = await orderModel.find({ customerID: customerId });
    if (!orders.length)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "No orders found for this customer",
      );
    return orders.map(toOrderRes);
  };

  getBySellerId = async (sellerId: number): Promise<OrderRes[]> => {
    const orders = await orderModel.find({ sellerID: sellerId });
    if (!orders.length)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "No orders found for this seller",
      );
    return orders.map(toOrderRes);
  };

  getByTimeRange = async (
    startDate: Date,
    endDate: Date,
  ): Promise<OrderRes[]> => {
    const orders = await orderModel.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });
    if (!orders.length)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "No orders found in this time range",
      );
    return orders.map(toOrderRes);
  };

  create = async (orderBody: CreateOrderReq): Promise<OrderRes> => {
    const newOrder = await orderModel.create(orderBody);
    if (!newOrder)
      throw new ApiError(StatusCodes.BAD_REQUEST, "Create order failed");
    return toOrderRes(newOrder);
  };
}

export default new OrderService();
