import { createSlice,PayloadAction } from "@reduxjs/toolkit";



interface UserState{
    user: any | null;
    isEmailVerified: boolean;
    isLogingDialogOpen: boolean;
    isLoggedIn: boolean;
}

const initialState :UserState={
    user: null,
    isEmailVerified: false,
    isLogingDialogOpen: false,
    isLoggedIn: false
}



const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        setUser:(state,action:PayloadAction<any>)=>{
            state.user=action.payload;
            state.isLoggedIn=true;
        },
        setEmailVerified:(state,action:PayloadAction<any>)=>{
            state.isEmailVerified=action.payload
        },
        logout:(state)=>{
            state.user=null,
            state.isLoggedIn=false,
            state.isEmailVerified=false
        },
        toggleLoginDialog:(state)=>{
            state.isLogingDialogOpen=!state.isLogingDialogOpen
        },
        authStatus:(state)=>{
            state.isLoggedIn=true
        }
    }
    
})


export const {setUser,setEmailVerified,logout,toggleLoginDialog,authStatus}=userSlice.actions

export default userSlice.reducer