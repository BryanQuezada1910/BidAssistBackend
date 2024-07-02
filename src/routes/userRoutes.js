import express from 'express';
import { activeSuscription, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/userController.js';
import { validateUser, auth } from '../middlewares/authMiddleware.js';

export const usersRouter = express.Router();

usersRouter.get("", validateUser(['Admin']), getAllUsers);
usersRouter.get("/:id", validateUser(['Admin']), getUserById);
usersRouter.delete("/:id", validateUser(['Admin']), deleteUser);
usersRouter.put("/:id", validateUser(['Admin']), updateUser);
usersRouter.post("/activate/:id", auth, activeSuscription)
