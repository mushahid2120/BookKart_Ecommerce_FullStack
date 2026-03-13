import { NextFunction, Request, Response } from "express";
import response from "../Utility/response.js";
import { JWT_SECRET } from "../Config/env.js";
import jwt from "jsonwebtoken"

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

export async function authenticateUser(req:Request,res:Response,next:NextFunction){
    const token=req.cookies?.token
    if(!token){
        return response(res,400,"You are not logged In")
    }
    try {
        const decode=jwt.verify(token,JWT_SECRET) as jwt.JwtPayload
        if(!decode){
                    return response(res,400,"user not authorized")
        }
        req.id=decode.userId;
        next()
    } catch (error) {
        console.log(error)
        next(error)
    }
}