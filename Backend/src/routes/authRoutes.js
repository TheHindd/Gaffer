import express from "express";
import { changePassword, forgotPassword, login, logout, me, refreshToken, resetPassword } from "../controllers/authController.js";
import { authenticateMiddle } from "../middleware/authMiddle.js";
import { createUser } from "../controllers/userController.js";

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/register', createUser);
authRouter.post('/logout', logout);
authRouter.post('/resetpassword', resetPassword );
authRouter.post('/forgotpassword', forgotPassword);
authRouter.put('/firstloginpasswordreset', changePassword);
authRouter.get('/me', authenticateMiddle ,me);
authRouter.post('/refreshToker',authenticateMiddle ,refreshToken);

export default authRouter;