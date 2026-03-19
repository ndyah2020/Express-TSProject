import { StatusCodes } from "http-status-codes";
import orderModel, { IOrder } from "../models/order.model";
import ApiError from "../utils/ApiError";
import { CreateOrderReq } from "../validations/order.validation";

export class OrderService {
  get = async (): Promise<IOrder[]> => {
    const orders = await orderModel.find();
    if (!orders.length)
      throw new ApiError(StatusCodes.NOT_FOUND, "No orders found");
    return orders;
  };

  getById = async (orderId: string): Promise<IOrder> => {
    const order = await orderModel.findById(orderId);
    if (!order) throw new ApiError(StatusCodes.NOT_FOUND, "Order not found");
    return order;
  };

  getByCustomerId = async (customerId: number): Promise<IOrder[]> => {
    const orders = await orderModel.find({ customerID: customerId });
    if (!orders.length)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "No orders found for this customer",
      );
    return orders;
  };

  getBySellerId = async (sellerId: number): Promise<IOrder[]> => {
    const orders = await orderModel.find({ sellerID: sellerId });
    if (!orders.length)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "No orders found for this seller",
      );
    return orders;
  };

  getByTimeRange = async (
    startDate: Date,
    endDate: Date,
  ): Promise<IOrder[]> => {
    const orders = await orderModel.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });
    if (!orders.length)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "No orders found in this time range",
      );
    return orders;
  };

  create = async (orderBody: CreateOrderReq): Promise<IOrder> => {
    const newOrder = await orderModel.create(orderBody);
    if (!newOrder)
      throw new ApiError(StatusCodes.BAD_REQUEST, "Create order failed");
    return newOrder;
  };
}

export default new OrderService();
