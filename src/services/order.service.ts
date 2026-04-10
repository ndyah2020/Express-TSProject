import { StatusCodes } from "http-status-codes";
import orderModel from "../models/order.model";
import orderDetailModel from "../models/orderDetail.model";
import productModel from "../models/product.model";
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

    const details = await orderDetailModel.find({
      $or: [{ orderID: order._id }, { orderID: orderId as any }],
    });
    return {
      ...toOrderRes(order),
      details: details.map((detail) => ({
        productID: detail.productID.toString(),
        quantity: detail.quantity,
        price: detail.price,
        totalPrice: detail.totalPrice,
      })),
    };
  };

  getByCustomerId = async (customerId: string): Promise<OrderRes[]> => {
    const orders = await orderModel.find({ customerID: customerId });
    if (!orders.length)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "No orders found for this customer",
      );

    const details = await orderDetailModel.find({
      $or: [
        { orderID: { $in: orders.map((order) => order._id) } },
        { orderID: { $in: orders.map((order) => order._id.toString()) } },
      ],
    });

    const detailMap = details.reduce(
      (acc, detail) => {
        const key = detail.orderID.toString();

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push({
          productID: detail.productID.toString(),
          quantity: detail.quantity,
          price: detail.price,
          totalPrice: detail.totalPrice,
        });

        return acc;
      },
      {} as Record<
        string,
        {
          productID: string;
          quantity: number;
          price: number;
          totalPrice: number;
        }[]
      >,
    );

    return orders.map((order) => ({
      ...toOrderRes(order),
      details: detailMap[order._id.toString()] || [],
    }));
  };

  getBySellerId = async (sellerId: string): Promise<OrderRes[]> => {
    const orders = await orderModel.find({ sellerID: sellerId });
    if (!orders.length)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "No orders found for this seller",
      );

    const details = await orderDetailModel.find({
      $or: [
        { orderID: { $in: orders.map((order) => order._id) } },
        { orderID: { $in: orders.map((order) => order._id.toString()) } },
      ],
    });

    const detailMap = details.reduce(
      (acc, detail) => {
        const key = detail.orderID.toString();

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push({
          productID: detail.productID.toString(),
          quantity: detail.quantity,
          price: detail.price,
          totalPrice: detail.totalPrice,
        });

        return acc;
      },
      {} as Record<
        string,
        {
          productID: string;
          quantity: number;
          price: number;
          totalPrice: number;
        }[]
      >,
    );

    return orders.map((order) => ({
      ...toOrderRes(order),
      details: detailMap[order._id.toString()] || [],
    }));
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
    const details = await orderDetailModel.find({
      $or: [
        { orderID: { $in: orders.map((order) => order._id) } },
        { orderID: { $in: orders.map((order) => order._id.toString()) } },
      ],
    });
    const detailMap = details.reduce(
      (acc, detail) => {
        const key = detail.orderID.toString();

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push({
          productID: detail.productID.toString(),
          quantity: detail.quantity,
          price: detail.price,
          totalPrice: detail.totalPrice,
        });

        return acc;
      },
      {} as Record<
        string,
        {
          productID: string;
          quantity: number;
          price: number;
          totalPrice: number;
        }[]
      >,
    );

    return orders.map((order) => ({
      ...toOrderRes(order),
      details: detailMap[order._id.toString()] || [],
    }));
  };

  create = async (orderBody: CreateOrderReq): Promise<OrderRes> => {
    //const session = await mongoose.startSession();

    //try {
    let createdOrder: OrderRes | null = null;

    //await session.withTransaction(async () => {
    const { details, customerID, sellerID, totalCost, paymentMethod } =
      orderBody;

    const orders = await orderModel.create(
      [
        {
          customerID,
          sellerID,
          totalCost,
          paymentMethod,
        },
      ],
      //{ session },
    );

    const newOrder = orders[0];

    if (!newOrder) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Create order failed");
    }

    const orderDetails = details.map((detail) => ({
      orderID: newOrder._id,
      productID: detail.productID,
      quantity: detail.quantity,
      price: detail.price,
      totalPrice: detail.totalPrice,
    }));

    await orderDetailModel.create(
      orderDetails,
      /*{ session }*/
    );

    for (const detail of details) {
      const updatedProduct = await productModel.findByIdAndUpdate(
        detail.productID,
        { $inc: { inventory_quantity: -detail.quantity } },
        { new: true },
      );

      if (!updatedProduct) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
      }
    }

    createdOrder = toOrderRes(newOrder);
    //});

    if (!createdOrder) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Create order failed");
    }

    return {...createdOrder, details: orderDetails.map((detail) => ({
      productID: detail.productID.toString(),
      quantity: detail.quantity,
      price: detail.price,
      totalPrice: detail.totalPrice,
    }))};
    // } finally {
    //   await session.endSession();
    // }
    //};
  };
}
export default new OrderService();
