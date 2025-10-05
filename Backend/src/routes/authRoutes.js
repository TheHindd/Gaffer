import express from "express";
import { changePassword, forgotPassword, login, logout } from "../controllers/authController.js";
import { createUser } from "../controllers/userController.js";


const authRouter = express.Router();

authRouter.post('/register', createUser);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.put('/login/changepassword', changePassword);
authRouter.post('/forgotpassowrd', forgotPassword);


export default authRouter;