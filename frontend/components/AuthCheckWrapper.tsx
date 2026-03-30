"use client"
import { useLazyCheckUserQuery } from "@/store/api";
import { logout, setEmailVerified, setUser } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function AuthCheckWrapper({children}:{children:React.ReactNode}) {
    const [checkUser] = useLazyCheckUserQuery();
    const [isCheckingUser,setIsCheckingUser]=useState<Boolean>(true);
    const dispatch=useDispatch()
    const user=useSelector((state:RootState)=>state.user.user)
    const isLoggedIn=useSelector((state:RootState)=>state.user.isLoggedIn)
    async function checkingUser(){
      try {
        const response=await checkUser(null).unwrap();
        if(response.isSuccess){
          dispatch(setUser(response.data));
          // console.log(response.data)
          // dispatch(setEmailVerified(response.data.isVerified))
        }
        else{
          dispatch(logout())
        }
      } catch (error) {
        dispatch(logout())
        console.log(error)
      } finally{
        setIsCheckingUser(false);
      }
    }


    useEffect(()=>{
      checkingUser()
    },[checkUser,dispatch])
   
      if(isCheckingUser){
        return <h1>Loading Please Wait...</h1>
      }
      return children
}
