import express, { Request,NextFunction, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./Config/db.js";
import { PORT } from "./Config/env.js";
import AuthRouter from "./Route/authRoutes.js";
import productRouter from "./Route/productRoutes.js";

await dbConnect();

const app = express()


app.use(cors())
app.use(express.json())
app.use(cookieParser())
 
app.get("/",(req,res)=>{
        res.end("Welcome to this project")
})

app.use("/auth",AuthRouter)
app.use("/product",productRouter)

app.use((err:any, req:Request, res:Response, next:NextFunction) => {
  console.log("Global error handler");
  console.log(err)
  return res.status( 500).json({ error: "something-went-wrong" });
});


app.listen(PORT,()=>{
    console.log(`Server is running on Port:${PORT}`)
})


