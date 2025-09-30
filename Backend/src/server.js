import express from "express";
import dotenv from "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

const app = express();
const port= process.env.port;
connectDB();

//dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));

app.get("/", (req, res) => {
  res.send("Hello from backend!");
});


app.listen(port, () => {
    console.log(`server started on port:${port}`, "http://localhost:5000");
} );
