import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const GenerateAccesToken = (user) =>
    jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2m' });

const GenerateRefreshToken = (user) =>
    jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

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

        const newUser = new User({ name, lastname, username, email, password, isSuscribed: false });
        newUser.save()
            .then((savedUser) => {
                const refresh_token = GenerateRefreshToken(savedUser);

                User.findOneAndUpdate(
                    { _id: savedUser._id },
                    { refreshToken: refresh_token },
                    { new: true }
                ).then(() => console.log(`Add Refresh Token for ${savedUser._id}`));
            });

        const access_token = GenerateAccesToken(newUser);

        res.status(201).cookie('access_token', access_token, {
            httpOnly: true,
            maxAge: 3600000
        }).json({ message: "Successful" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

};

const login = async (req, res) => {
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



    } catch (error) {

    }

};

export { register, login };