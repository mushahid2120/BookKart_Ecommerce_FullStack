import { NextFunction, Request, Response } from "express";
import Cart from "../Model/Cart.js";
import { ObjectId } from "mongoose";
import response from "../Utility/response.js";
import Order from "../Model/Order.js";

export async function getOrderByUserId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.id;
    const order = await Order.find({
      user: userId as unknown as ObjectId,
    }).lean();
    if (!order) {
      response(res, 400, "Invalid User");
    }
    return response(res, 200, "User have these Order", order);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getOrderByOrderId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { orderId } = req.params;
    if (orderId) {
      response(res, 400, "OrderId is required");
    }
    const order = await Order.findById(orderId).lean();
    if (!order) {
      response(res, 400, "Invalid Order id");
    }
    response(res, 200, "Your order By orderId", order);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function createUpdateOrder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.id;
    const {
      orderId,
      cartId,
      shippingAddress,
      paymentStatus,
      paymentMethod,
      paymentDetail,
      status,
    } = req.body;

    const cart = await Cart.findById(cartId)
      .populate("item.product", "quantity finalPrice shippingCharge _id")
      .select("item -_id");

    // return res.status(400).json({cart})
    if (!cart || cart?.item?.length === 0) {
      return response(res, 400, "Cart is Empty");
    }
    let order = await Order.findById(orderId);

    if (order) {
      order.items=cart.item.map((it)=>({product:(it.product as any)._id,quantity:it.quantity}))
      order.shippingAddress = shippingAddress || order.shippingAddress;
      order.paymentMethod = paymentMethod || order.paymentMethod;
      order.status = status;
      order.totalAmount = cart.item.reduce(
        (acc: number, item: any) =>
          acc +
          item.product.finalPrice * item.quantity +
          item.product.shippingCharge,
        0,
      );
      if (paymentDetail) {
        order.paymentMethod = paymentMethod;
        order.paymentStatus = paymentStatus;
        order.paymentDetail = paymentDetail;
      }
      await order.save();
    } else {
      response(res, 404, "order has been not been created");
    }

    if (paymentDetail) {
      await Cart.findOneAndUpdate(
        { user: userId as unknown as ObjectId },
        { $set: { item: [] } },
      );
    }
    return response(res, 200, "Order Created Successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function createPaymentWithRazorPay(
  req: Request,
  res: Response,
  next: NextFunction,
) {}

export async function handleRazorPayWebhook(
  req: Request,
  res: Response,
  next: NextFunction,
) {}
