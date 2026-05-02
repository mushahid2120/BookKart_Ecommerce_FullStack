export interface IOrderProduct {
  title: string;
  subject: string;
  author: string;
  price: number;
  finalPrice: number;
  shippingCharge: number;
  _id: string;
  images: string[];
}

export interface IOrderItem {
  product: IOrderProduct;
  quantity: number;
}

export interface IOrder {
  _id: string;
  items: IOrderItem[];
  shippingAddress?: IAddress;
  totalAmount: number;
  paymentStatus: "pending" | "complete" | "failed";
  paymentMethod?: "UPI" | "Bank Account";
  paymentDetail?: {
    razorpay_order?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  status: "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface IAddress {
  _id: string;
  addressLine1: string;
  addressLine2?: string | null;
  phoneNumber?: string;
  city: string;
  state: string;
  pin: string;
}
