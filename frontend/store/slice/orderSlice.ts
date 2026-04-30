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
  currentSelectedShippingAddress?:number ;
  shippingAddress?: IAddress[];
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
  shippingAddress: [],
  currentSelectedShippingAddress:-1,
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
    setOrderItem: (state, action: PayloadAction<IOrder>) => {
      state._id = action.payload._id;
      state.items = action.payload.items;
      state.totalAmount = state.items?.reduce(
        (acc: number, item: any) =>
          acc +
          item.product.finalPrice * item.quantity +
          item.product.shippingCharge,
        0,
      );
      state.status=action.payload.status;
    },
    setShippingAddress:(state,action:PayloadAction<IAddress>)=>{
      state.shippingAddress?.push(action.payload)
    },
    setCurrentSelectAddress:(state,action:PayloadAction<number>)=>{
      if(!state.shippingAddress) return 
      if(action.payload<0 && action.payload>=state.shippingAddress?.length) return 
      state.currentSelectedShippingAddress=action.payload
    }
  },
});

export const { setOrderItem,setShippingAddress } = orderSlice.actions;

export default orderSlice.reducer;
