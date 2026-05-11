import Cart from "../Model/Cart.js";
import response from "../Utility/response.js";
import Order from "../Model/Order.js";
import Razorpay from "razorpay";
import { RAZORPAY_KEY, RAZORPAY_SECRET_KEY } from "../Config/env.js";
export async function getOrderByUserId(req, res, next) {
    try {
        const userId = req.id;
        const order = await Order.find({
            user: userId,
        })
            .populate("shippingAddress", "addressLine1 addressLine2 city phoneNumber pin state")
            .populate({
            path: "items.product",
            select: {
                title: 1,
                subject: 1,
                author: 1,
                finalPrice: 1,
                price: 1,
                shippingCharge: 1,
                images: { $slice: 1 }, // Only fetches the first element in the array
            },
        })
            .lean();
        if (!order) {
            response(res, 400, "Invalid User");
        }
        return response(res, 200, "User have these Order", order);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
export async function getOrderByOrderId(req, res, next) {
    try {
        const { orderId } = req.params;
        if (!orderId || orderId === "null") {
            return response(res, 400, "OrderId is required");
        }
        const order = await Order.findById(orderId)
            .populate("shippingAddress", "addressLine1 addressLine2 city phoneNumber pin state")
            .populate("items.product", "title finalPrice price shippingCharge")
            .select("items totalAmount paymentStatus paymentMethod status shippingAddress ")
            .lean();
        if (!order) {
            return response(res, 400, "Invalid Order id");
        }
        return response(res, 200, "Your order By orderId", order);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
export async function createUpdateOrder(req, res, next) {
    try {
        const userId = req.id;
        const { orderId, cartId, shippingAddress, paymentStatus, paymentMethod, paymentDetail, status, } = req.body;
        const cart = await Cart.findById(cartId)
            .populate("item.product", "quantity finalPrice shippingCharge _id")
            .select("item");
        // return res.status(400).json({cart})
        if (!cart || cart?.item?.length === 0) {
            return response(res, 400, "Cart is Empty");
        }
        const itemTotalAmount = cart.item.reduce((acc, item) => acc +
            item.product.finalPrice * item.quantity +
            item.product.shippingCharge, 0);
        let order = await Order.findById(orderId);
        if (order) {
            order.items =
                cart.item.map((it) => ({
                    product: it.product._id,
                    quantity: it.quantity,
                })) || order.items;
            order.shippingAddress = shippingAddress;
            order.status = status || order.status;
            order.totalAmount = itemTotalAmount || order.totalAmount;
            if (paymentDetail) {
                const parsePaymentDetail = JSON.parse(paymentDetail);
                order.paymentStatus = paymentStatus;
                order.paymentDetail = parsePaymentDetail;
            }
            await order.save();
        }
        else {
            order = new Order({
                user: userId,
                items: cart.item.map((it) => ({
                    product: it.product._id,
                    quantity: it.quantity,
                })),
                totalAmount: itemTotalAmount,
                shippingAddress,
                paymentStatus,
                paymentMethod,
                paymentDetail,
                status,
            });
            const orderResult = await order.save();
            cart.orderId = orderResult._id;
            const cartResult = await cart.save();
        }
        if (paymentDetail && paymentStatus === "complete") {
            await Cart.findOneAndUpdate({ user: userId }, { $set: { item: [], orderId: null } });
        }
        return response(res, 200, "Order Created Successfully");
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
export async function createOrderWithRazorPay(req, res, next) {
    try {
        const userId = req.id;
        const { orderId, totalAmount } = req.body;
        if (!orderId || !totalAmount) {
            response(res, 404, "OrderId and totalAmount is required");
        }
        const rzpIntance = new Razorpay({
            key_id: RAZORPAY_KEY,
            key_secret: RAZORPAY_SECRET_KEY,
        });
        const order = await rzpIntance.orders.create({
            amount: totalAmount * 100,
            currency: "INR",
            notes: {
                customer_id: userId || 'unknown',
                orderId
            },
        });
        response(res, 200, "You Order Id ", { orderid: order.id });
    }
    catch (error) {
        console.log(error);
    }
}
export async function handleRazorPayWebhook(req, res, next) { }
