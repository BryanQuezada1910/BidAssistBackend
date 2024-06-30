import bcrypt from 'bcrypt';
import User from '../models/User.js';
import dotenv from 'dotenv';
import { addUser } from '../services/userService.js';
import { GenerateAccesToken, GenerateRefreshToken } from '../services/JWTService.js';
import { MailWrapper } from '../services/emailService.js';

dotenv.config({ path: '../../.env' });

const register = async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ message: 'The body of the request is empty' });
    }

    const { name, lastname, username, email, password } = req.body;

    if (!name || !lastname || !username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "The user already exists" });
        }

        user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "The email has already been taken" });
        }

        const userInfo = {
            name: name,
            lastname: lastname,
            username: username,
            email: email,
            password: password
        };

        const newUser = addUser(userInfo);
        const access_token = GenerateAccesToken(newUser);

        MailWrapper.sendWelcomeEmail([newUser.email], newUser.username);

        res.status(201).cookie('access_token', access_token, {
            httpOnly: false,
            maxAge: 3600000
        }).json({ username: newUser.username, email: newUser.email });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }

};

const login = async (req, res) => {

    const user = req.session.user;
    if (user) {
        return res.status(200).json({
            username: user.username,
            email: user.email
        });
    }

    if (!req.body) {
        return res.status(400).json({ message: 'The body of the request is empty' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "The user does not exist" });
        }

        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const access_token = GenerateAccesToken(user);
        const newRefreshToken = GenerateRefreshToken(user);
        await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });

        res.status(200).cookie('access_token', access_token, {
            httpOnly: false,
            maxAge: 3600000
        }).json({ username: user.username, email: user.email });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "No email was provided" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email is not registered" });
        }

        const userEmail = user.email;
        MailWrapper.sendResetPasswordEmail([userEmail], "test.com");

        res.status(200).json({ message: "Email has sent" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error ocurred" });
    }

};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const updatePassword = async (req, res) => {

    const user = req.session.user;
    if (!user) {
        return res.status(401).json({
            message: "Access Denied"
        });
    }

    const { currentPassword, password } = req.body;

    if (!currentPassword || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const currentUserInfo = await User.findById(user.id);

        const isPassValid = await bcrypt.compare(currentPassword, currentUserInfo.password);
        if (!isPassValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const newRefreshToken = GenerateRefreshToken(user);
        const newPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(currentUserInfo._id, { password: newPassword, refreshToken: newRefreshToken });
        MailWrapper.sendPasswordResetConfirmationEmail([currentUserInfo.email], currentUserInfo.username);
        res.status(200).json({ message: "Password has been updated" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }

};

const logout = (req, res) => {
    res.clearCookie('access_token', { httpOnly: false, domain: 'localhost', path: '/' });
    return res.status(204).end();
};

export { register, login, logout, forgotPassword, updatePassword };