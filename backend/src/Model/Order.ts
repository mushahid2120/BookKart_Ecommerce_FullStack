import { Document, model, Schema } from "mongoose";
import { IAddress } from "./Address.js";

interface IOrderItem extends Document {
  product: Schema.Types.ObjectId;
  quantity: number;
}

interface IOrder extends Document {
  user: Schema.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress: Schema.Types.ObjectId | IAddress;
  paymentStatus: "pending" | "complete" | "failed";
  paymentMethod: string;
  paymentDetail: {
    razorpay_order?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  status: "processing" | "shipped" | "delivered" | "cancelled";
}

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  items: {
    product: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    quantity: { type: Number, required: true },
  },
  totalAmount:{type:Number,required:true},
  shippingAddress:{type:Schema.Types.ObjectId,required:true},
  paymentStatus:{type:String,enum:["pending" ,"complete" , "failed"],default:"pending"},
  paymentMethod:{type:String,required:true},
  paymentDetail:{

    
  },
  status:{type:String,enum:['processing' ,'shipped' , 'delivered' ,'cancelled']}
});


const Order=model('Order',OrderSchema)

export default Order;