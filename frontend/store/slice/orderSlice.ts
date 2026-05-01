import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IOrderProduct{
    title: string;
    price: number;
    finalPrice: number;
    shippingCharge: number;
    _id: string;
    image: string;
  }

export interface IOrderItem {
  product: IOrderProduct;
  quantity: number;
}

export interface IOrder {
  _id?: string;
  items?: IOrderItem[];
  totalAmount?: number;
  shippingAddress?: IAddress ;
  paymentStatus?: "pending" | "complete" | "failed";
  paymentMethod?: "UPI" | "Bank Account";
  paymentDetail?: {
    razorpay_order?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  status?: "processing" | "shipped" | "delivered" | "cancelled";
}

export interface IAddress {
  _id:string;
  addressLine1: string;
  addressLine2?: string | null;
  phoneNumber?: string;
  city: string;
  state: string;
  pin: string;
}

const initialState: IOrder = {
  _id: "",
  items: [],
  totalAmount: 0,
  shippingAddress: undefined,
  paymentStatus: "pending",
  paymentMethod: "UPI",
  paymentDetail: {
    razorpay_order: "",
    razorpay_payment_id: "",
    razorpay_signature: "",
  },
  status: "processing",
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<IOrder>) => {
     return action.payload;
    }
  },
});

export const { setOrder } = orderSlice.actions;

export default orderSlice.reducer;
