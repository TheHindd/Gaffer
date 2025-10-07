import express from "express";
import { getUsers, getUserById, updateUser, deleteUser, getUserByName, createUser } from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.post('/', createUser);
userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.get('/:id', getUserByName);
userRouter.patch('/:id', updateUser);
userRouter.delete('/:id', deleteUser);