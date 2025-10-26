import express from "express";
import dotenv from "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/mongodb.js";
import authRouter from "./src/routes/authRoutes.js";
import projectRouter from "./src/routes/projectRoutes.js";
import taskRouter from "./src/routes/taskRoutes.js";
import userRouter from "./src/routes/userRoutes.js";

const app = express();
const port= process.env.PORT;
const allowedOrigins= process.env.CLIENT_URL;
connectDB();


//dotenv.config();

app.use(express.json());
//app.use(cookieParser());
app.use(cors({Origin: allowedOrigins, credentials:true}));

//API Routes
app.get("/", (req, res) => {res.send("Hello from backend!");});
app.use("/api/auth", authRouter)
app.use("/api/projects", projectRouter)
app.use("/api/tasks", taskRouter)
app.use("/api/users", userRouter)

app.listen(port, () => {
    console.log(`server started on port:${port}`, "http://localhost:5000");
} );
