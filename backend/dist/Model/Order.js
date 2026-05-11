import { model, Schema } from "mongoose";
const OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    items: [
        {
            product: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
            quantity: { type: Number, required: true, default: 1 },
        },
    ],
    totalAmount: { type: Number, required: true, default: 0 },
    shippingAddress: { type: Schema.Types.ObjectId, ref: "Address" },
    paymentStatus: {
        type: String,
        enum: ["pending", "complete", "failed", null],
        default: null,
    },
    paymentDetail: {
        razorpay_order_id: { type: String },
        razorpay_payment_id: { type: String },
        razorpay_signature: { type: String },
    },
    status: {
        type: String,
        enum: ["processing", "shipped", "delivered", "cancelled", null],
        default: null,
    },
}, {
    timestamps: true
});
const Order = model("Order", OrderSchema);
export default Order;
