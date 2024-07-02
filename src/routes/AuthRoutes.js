import express from 'express';
import { auth } from '../middlewares/authMiddleware.js';
import { forgotPassword, login, logout, register, updatePassword, resetPassword } from '../controllers/authController.js';

export const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', auth, login);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/update-password', auth, updatePassword);
authRouter.get('/logout', logout);

