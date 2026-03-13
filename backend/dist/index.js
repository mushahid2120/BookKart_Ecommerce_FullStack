import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./Config/db.js";
import { PORT } from "./Config/env.js";
await dbConnect();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
    res.end("Welcome to this project");
});
app.use((err, req, res, next) => {
    console.log("Global error handler");
    return res.status(500).json({ error: "something-went-wrong" });
});
app.listen(PORT, () => {
    console.log(`Server is running on Port:${PORT}`);
});
