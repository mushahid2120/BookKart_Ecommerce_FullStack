import { model, Schema } from "mongoose";
const OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    items: [{
            product: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
            quantity: { type: Number, required: true },
        }],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: Schema.Types.ObjectId, required: true },
    paymentStatus: { type: String, enum: ["pending", "complete", "failed"], default: "pending" },
    paymentMethod: { type: String, enum: ['UPI', 'Bank Account'], default: null },
    paymentDetail: {
        razorpay_order: { type: String },
        razorpay_payment_id: { type: String },
        razorpay_signature: { type: String }
    },
    status: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'] }
});
const Order = model('Order', OrderSchema);
export default Order;
