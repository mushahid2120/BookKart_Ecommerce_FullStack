import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser{
            name: string;
        email: string;
        phoneNumber: string;
}

interface IItems {
  products: {
    _id: string;
    title: string;
    category: string;
    paymentMode: string;
    paymentDetails: {
      UpiId?: string;
      bankDetails?: string;
    };
  };
  quantity: number;
  _id: string;
}

interface IShippingAddress{
        addressLine1: string;
        addressLine2: string;
        city: string;
        phoneNumber: string;
        pin: string;
        state: string;
}

export interface IOrder{
      _id: string;
      user: IUser;
      items: IItems[];
      totalAmount: number;
      paymentStatus: string;
      status: string;
      createdAt: string;
      shippingAddress: IShippingAddress
    }

interface dashboardState {
  order: IOrder[] | null
  totalUser: number;
  totalProducts: number;
}


const initialState: dashboardState = {
  order:null,
  totalUser:0,
  totalProducts:0,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminDashboard: (state, action: PayloadAction<dashboardState>) => {
      state.order=action.payload.order;
      state.totalProducts=action.payload.totalProducts;
      state.totalUser=action.payload.totalUser;
    },
  },
});

export const { setAdminDashboard } = adminSlice.actions;

export default adminSlice.reducer;
