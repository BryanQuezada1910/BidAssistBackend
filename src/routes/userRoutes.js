import express from 'express';
import { auth } from '../middlewares/Auth.js'
import { activeSuscription, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/userController.js';

const usersRouter = express.Router();

usersRouter.get("", getAllUsers);
usersRouter.get("/:id", getUserById);
usersRouter.delete("/:id", deleteUser);
usersRouter.put("/:id", updateUser);
usersRouter.post("/activate/:id", auth, activeSuscription)

export { usersRouter };