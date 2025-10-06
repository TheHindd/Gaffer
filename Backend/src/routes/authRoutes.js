import express from "express";
import { changePassword, forgotPassword, login, logout, resetPassword } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/resetpassword', resetPassword );
authRouter.post('/forgotpassword', forgotPassword);
authRouter.put('/firstloginpasswordreset', changePassword);

export default authRouter;