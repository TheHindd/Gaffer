import express from "express";
import { login, logout } from "../controllers/authController.js";
import { createUser } from "../controllers/userController.js";

const authRouter = express.Router();

authRouter.post('/register', createUser);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

export default authRouter;