import { Request,Response,NextFunction } from "express";
import User from "../Model/User.js";
import response from "../Utility/response.js";



export async function updateUserProfile(req:Request,res:Response,next:NextFunction){
    const userId = req.id;
    const {userName,email,phoneNumber}=req.body;
    console.log(userName,email)
    if(!userName || !email ){
        return response(res,404,"Name , Email is required")
    }
    const user=await User.findByIdAndUpdate(userId,{name:userName,email,phoneNumber})
    if(!user){
        return response(res,404,"User not found")
    }
    return response(res,200,"User Profile has been updated")
}