import express from "express";
import { changePassword, login, logout } from "../controllers/authController.js";


const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/changepassword', changePassword);

export default authRouter;