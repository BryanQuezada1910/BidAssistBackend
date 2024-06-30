import express from 'express';
import { auth } from '../middlewares/Auth.js';
import { forgotPassword, login, logout, register, updatePassword } from '../controllers/AuthController.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', auth, login);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/update-password', auth, updatePassword);
authRouter.get('/logout', logout);

authRouter.get('/protected', auth, (req, res) => {
    if (req.session.user) {
        return res.status(200).send("Protected Route Test").end();
    }
    res.status(401).send("Access Denied");
});

export { authRouter };
