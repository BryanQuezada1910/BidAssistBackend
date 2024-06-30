import express from 'express';
import { auth } from '../middlewares/Auth.js';
import { forgotPassword, login, logout, register, updatePassword } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', auth, login);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/update-password', auth, updatePassword);
authRouter.get('/logout', logout);

export { authRouter };
