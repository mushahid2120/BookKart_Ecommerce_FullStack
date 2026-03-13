import { Response } from "express";

export default function response(
  res: Response,
  statusCode: number,
  message: string | null,
  data: object | null = null,
) {
  if (statusCode >= 200 && statusCode < 400) {
    return res.status(statusCode).json({ isSuccess:true, message, data });
  }
  return res.status(statusCode).json({ isSuccess:false, message });
}
