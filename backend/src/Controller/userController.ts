import { Request,Response,NextFunction } from "express";
import User from "../Model/User.js";
import response from "../Utility/response.js";



export async function updateUserProfile(req:Request,res:Response,next:NextFunction){
    const userId = req.id;
    const {name,email,phoneNumber}=req.body;
    if(!name || !email || !phoneNumber){
        return response(res,404,"Name , Email, Phone Number is required")
    }
    const user=await User.findByIdAndUpdate(userId,{name,email,phoneNumber})
    if(!user){
        return response(res,404,"User not found")
    }
    return response(res,200,"User Profile has been updated")
}