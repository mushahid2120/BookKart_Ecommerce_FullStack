import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./Config/db.ts";
import { PORT } from "./Config/env.ts";

await dbConnect();

const app = express()


app.use(cors())
app.use(express.json())
app.use(cookieParser())
 
app.get("/",(req,res)=>{
        res.end("Welcome to this project")
})


app.listen(PORT,()=>{
    console.log(`Server is running on Port:${PORT}`)
})


