import { createSlice,PayloadAction } from "@reduxjs/toolkit";



interface cartItemState{
  title: string;
  finalPrice:string;
  price:string;
  image:string;
  _id:string;
  quantity:number;
  shippingCharge:number;
}

interface cartState{
  product:cartItemState[],
  checkoutStatus:"cart" | "address" | "payment"
}

const initialState :cartState={
    product:[],
    checkoutStatus:"cart"
}



const cartSlice=createSlice({
    name:"wishlist",
    initialState,
    reducers:{
        setCart:(state,action:PayloadAction<cartItemState[]>)=>{
          state.product=[...action.payload]
        }
    }
    
})


export const {setCart}=cartSlice.actions

export default cartSlice.reducer