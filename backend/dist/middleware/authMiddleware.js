import response from "../Utility/response.js";
import { JWT_SECRET } from "../Config/env.js";
import jwt from "jsonwebtoken";
export async function authenticateUser(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        return response(res, 400, "You are not logged In");
    }
    try {
        const decode = jwt.verify(token, JWT_SECRET);
        if (!decode) {
            return response(res, 400, "user not authorized");
        }
        req.id = decode.userId;
        next();
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
