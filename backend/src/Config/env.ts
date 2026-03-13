import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 4000;
export const FRONTEND_URL=process.env.FRONTEND_URL as string;
export const MONGO_URI = process.env.MONGO_URI as string;
export const BREVO_KEY_ID=process.env.BREVO_KEY_ID as string;
export const SENDER_EMAIL=process.env.SENDER_EMAIL as string;
export const JWT_SECRET=process.env.JWT_SECRET as string