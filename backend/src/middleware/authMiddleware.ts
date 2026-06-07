import { NextFunction, Request, Response } from "express";
import response from "../Utility/response.js";
import { JWT_SECRET } from "../Config/env.js";
import jwt from "jsonwebtoken";
import User from "../Model/User.js";

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.token;
  if (!token) {
    return response(res, 400, "You are not logged In");
  }
  try {
    const decode = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    if (!decode) {
      return response(res, 400, "user not authorized");
    }
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function authAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const isUserAdmin = await User.findById(req.id).select("admin -_id").lean();
    if (!isUserAdmin || !isUserAdmin?.admin) {
      return response(res, 400, "you are not admin");
    }
    response(res, 200, "admin logged in");
  } catch (error: any) {
    console.log(error);
    return next(error);
  }
}
