import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {  createOrderWithRazorPay, createUpdateOrder, getOrderByOrderId, getOrderByUserId} from "../Controller/orderController.js";


const orderRouter=Router()

orderRouter.get('/get-order-by-userid',authenticateUser,getOrderByUserId);
orderRouter.get('/get-order-by-orderid/:orderId',authenticateUser,getOrderByOrderId);
orderRouter.post('/create-update-order',authenticateUser,createUpdateOrder);
orderRouter.post('/create-order',authenticateUser,createOrderWithRazorPay);

export default orderRouter