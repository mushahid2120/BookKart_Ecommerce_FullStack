import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../Config/env.js";
export const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
};
