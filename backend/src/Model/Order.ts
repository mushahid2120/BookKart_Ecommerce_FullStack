import { Document, model, Schema } from "mongoose";

interface IOrderItem {
  product: Schema.Types.ObjectId;
  quantity: number;
}

interface IOrder extends Document {
  user: Schema.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress?: Schema.Types.ObjectId | null;
  paymentStatus: "pending" | "complete" | "failed" | null;
  paymentMethod?: "UPI" | "Bank Account" | null;
  paymentDetail?: {
    razorpay_order?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  } | null;
  status: "processing" | "shipped" | "delivered" | "cancelled" | null;
}

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  items: [
    {
      product: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  totalAmount: { type: Number, required: true, default: 0 },
  shippingAddress: { type: Schema.Types.ObjectId },
  paymentStatus: {
    type: String,
    enum: ["pending", "complete", "failed", null],
    default: null,
  },
  paymentMethod: {
    type: String,
    enum: ["UPI", "Bank Account", null],
    default: null,
  },
  paymentDetail: {
    razorpay_order: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
  },
  status: {
    type: String,
    enum: ["processing", "shipped", "delivered", "cancelled", null],
    default: null,
  },
});

const Order = model("Order", OrderSchema);

export default Order;
