export interface IOrderItem {
  product: string
  quantity: number;
}

export interface IOrder {
    orderId?:string;
    cartId: string;
  shippingAddress?: IAddress;
  paymentStatus: "pending" | "complete" | "failed";
  paymentMethod?: "UPI" | "Bank Account" ;
  paymentDetail?: {
    razorpay_order?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  status: "processing" | "shipped" | "delivered" | "cancelled";
}

export interface IAddress  {
    user:string;
    addressLine1: string;
    addressLine2:string | null;
    phoneNumber: string;
    city:string;
    state:string;
    pin:string
}
