import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface queryState{
    query:string;
}

const initialState: queryState = {
  query:''
};

const productQuerySlice = createSlice({
  name: "productQuery",
  initialState,
  reducers: {
    setQuery: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.query=action.payload
    },
  },
});

export const { setQuery} = productQuerySlice.actions;

export default productQuerySlice.reducer;
