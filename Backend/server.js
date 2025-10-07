import express from "express";
import dotenv from "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/mongodb.js";
import authRouter from "./src/routes/authRoutes.js";
import projectRouter from "./src/routes/projectRoutes.js";

const app = express();
const port= process.env.PORT;
connectDB();

//dotenv.config();

app.use(express.json());
//app.use(cookieParser());
app.use(cors({credentials:true}));

//API Routes
app.get("/", (req, res) => {res.send("Hello from backend!");});
app.use("/api/auth", authRouter)
app.use("/api/project", projectRouter)


app.listen(port, () => {
    console.log(`server started on port:${port}`, "http://localhost:5000");
} );
