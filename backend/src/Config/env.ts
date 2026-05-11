import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 4000;
export const FRONTEND_URL=process.env.FRONTEND_URL as string;
export const MONGO_URI = process.env.MONGO_URI as string;
export const BREVO_KEY_ID=process.env.BREVO_KEY_ID as string;
export const SENDER_EMAIL=process.env.SENDER_EMAIL as string;
export const JWT_SECRET=process.env.JWT_SECRET as string;
export const CLOUDINARY_API_KEY=process.env.CLOUDINARY_API_KEY as string;
export const CLOUDINARY_SECRET_KEY=process.env.CLOUDINARY_SECRET_KEY as string;
export const CLOUDINARY_PROJECTNAME=process.env.CLOUDINARY_PROJECTNAME as string;
export const RAZORPAY_KEY=process.env.RAZORPAY_KEY as string;
export const RAZORPAY_SECRET_KEY=process.env.RAZORPAY_SECRET_KEY as string;
export const COOKIES_SAMESITE=process.env.COOKIES_SAMESITE as "none" | "lax" | "strict";