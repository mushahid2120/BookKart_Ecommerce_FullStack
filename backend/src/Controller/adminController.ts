import { NextFunction, Request, Response } from "express";
import Order from "../Model/Order.js";
import User from "../Model/User.js";
import response from "../Utility/response.js";
import Product from "../Model/Product.js";

export async function getOrderDashBoard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const order = await Order.find()
      .select(
        "totalAmount items status user paymentStatus createdAt paymentDetails",
      )
      .populate("user", "name email phoneNumber -_id")
      .populate({
        path: "items.product",
        select: {
          paymentMode: 1,
          paymentDetails: 1,
          title: 1,
          category: 1,
          images: { $slice: 1 },
          seller: 1,
          finalPrice: 1
        },
        populate:{
          path: "seller",
          select:{
            name: 1,
            email: 1,
            phoneNumber:1,
            _id: 0
          }
        }
      })
      .populate(
        "shippingAddress",
        "addressLine1 addressLine2 phoneNumber city state pin -_id",
      )
      .lean();
    const totalUser = await User.estimatedDocumentCount();
    const totalProducts = await Product.estimatedDocumentCount();
    return response(res, 200, "Your Dashboard Data", {
      order,
      totalUser,
      totalProducts,
    });
  } catch (error: any) {
    console.log(error);
    return next(error);
  }
}

export async function updateOrder(req:Request,res:Response,next:NextFunction){
  try {
    const {orderId}=req.params;
    const {status,paymentStatus}=req.body;
    const order=await Order.findByIdAndUpdate(orderId,{status,paymentStatus})
    if(!order){
      return response(res,404,"Invalid orderId")
    }
    return response(res,200,"Your Order Status has been updated")
  } catch (error:any) {
    console.log(error)
    return next(error)
  }
}

export async function sellerPayment(req:Request,res:Response,next:NextFunction){
  try {
    
  } catch (error:any) {
    console.log(error)
    return next(error)
  }
}
