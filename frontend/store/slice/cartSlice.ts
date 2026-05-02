import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICartProduct {
  title: string;
  finalPrice: number;
  price: number;
  image: string;
  _id: string;
  shippingCharge: number;
}

interface cartItemState {
  product: ICartProduct;
  quantity: number;
}

interface cartState {
  item: cartItemState[];
  checkoutStatus: "cart" | "address" | "payment";
  orderId: string;
  cartId: string;
}

const initialState: cartState = {
  item: [],
  checkoutStatus: "cart",
  orderId: "",
  cartId: "",
};

const cartSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<cartState>) => {
      state.orderId = action.payload.orderId;
      state.cartId = action.payload.cartId;
      state.item = action.payload.item;
    },
    changeCheckoutStatus: (
      state,
      action: PayloadAction<"cart" | "address" | "payment">,
    ) => {
      state.checkoutStatus = action.payload;
    },
  },
});

export const { setCart, changeCheckoutStatus } = cartSlice.actions;

export default cartSlice.reducer;
