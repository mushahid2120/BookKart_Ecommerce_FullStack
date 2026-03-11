import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
    res.end("Welcome to this project");
});
app.listen(PORT, () => {
    console.log(`Server is running on Port:${PORT}`);
});
