import express from 'express';
import { deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/userController.js';

const usersRouter = express.Router();

usersRouter.get("", getAllUsers);
usersRouter.get("/:id", getUserById);
usersRouter.delete("/:id", deleteUser);
usersRouter.put("/:id", updateUser);

export { usersRouter };