import { Router } from "express";
import { authAdmin, authenticateUser } from "../middleware/authMiddleware.js";
import {  getOrderDashBoard, sellerPayment, updateOrder } from "../Controller/adminController.js";

const adminRouter=Router()

adminRouter.get("/order-dashboard",getOrderDashBoard)
adminRouter.put("/update-order/:orderId",updateOrder)
adminRouter.get("/seller-payment",sellerPayment);


export default adminRouter