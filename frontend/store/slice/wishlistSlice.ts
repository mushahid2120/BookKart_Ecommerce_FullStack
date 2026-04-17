import { createSlice,PayloadAction } from "@reduxjs/toolkit";



interface wishlistItemState{
  title: string;
  finalPrice:string;
  images:string;
  _id:string;
}

interface wishlistState{
  product:wishlistItemState[]
}

const initialState :wishlistState={
    product:[]
}



const wishlistSlice=createSlice({
    name:"wishlist",
    initialState,
    reducers:{
        setWishlist:(state,action:PayloadAction<wishlistState>)=>{
          state.product=[...action.payload.product]
        }
    }
    
})


export const {setWishlist}=wishlistSlice.actions

export default wishlistSlice.reducer