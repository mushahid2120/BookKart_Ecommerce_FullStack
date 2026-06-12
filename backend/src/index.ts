import express, { Request,NextFunction, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./Config/db.js";
import { FRONTEND_URL, PORT } from "./Config/env.js";
import AuthRouter from "./Route/authRoutes.js";
import productRouter from "./Route/productRoutes.js";
import cartRouter from "./Route/cartRoutes.js";
import wishListRouter from "./Route/wishListRoutes.js";
import addressRouter from "./Route/addressRoutes.js";
import userRouter from "./Route/userRoutes.js";
import orderRouter from "./Route/orderRoutes.js";
import adminRouter from "./Route/adminRouter.js";

await dbConnect();

const app = express()


const allowedOrigins = FRONTEND_URL.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);



app.use(express.json())
app.use(cookieParser())
 
app.get("/",(req,res)=>{
        res.end("Welcome to this project")
})

app.use("/auth",AuthRouter)
app.use("/product",productRouter)
app.use("/cart",cartRouter)
app.use("/wishlist",wishListRouter)
app.use("/address",addressRouter)
app.use("/user",userRouter)
app.use("/order",orderRouter)
app.use("/admin",adminRouter)

app.use((err:any, req:Request, res:Response, next:NextFunction) => {
  console.log("Global error handler");
  console.log(err)
  return res.status( 500).json({ error: "something-went-wrong" });
});


app.listen(PORT,()=>{
    console.log(`Server is running on Port:${PORT}`)
})


