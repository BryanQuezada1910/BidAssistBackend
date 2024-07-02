import User from "../models/User.js";
import { GenerateAccesToken } from '../services/JWTService.js';

// GET: http://+:5000/api/user
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET: http://+:5000/api/user/:id
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getUserById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "ID is required" });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// DELETE: http://+:5000/api/user/:id
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "ID is required" });
    }

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// PUT: http://+:5000/api/user/:id
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const updateUser = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "ID is required" });
    }

    if (!req.body) {
        return res.status(400).json({ message: 'The body of the request is empty' });
    }

    const { name, lastname } = req.body;

    if (!name || !lastname) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await User.findByIdAndUpdate(id, {
            name: name,
            lastname: lastname
        }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

};

// POST: http://+:5000/api/user/:id
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const activeSuscription = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "ID is required" });
    }

    try {
        const user = await User.findByIdAndUpdate(id, { isSuscribed: true }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a new access token on jwtservice
        const access_token = GenerateAccesToken(user);

        // Delete de User cookie to send new isSuscribed cookie
        res.clearCookie('access_token', { httpOnly: false });

        res.status(200).cookie('access_token', access_token, {
            httpOnly: false,
            maxAge: 3600000
        }).json({ username: user.username, email: user.email });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export { getAllUsers, getUserById, deleteUser, updateUser, activeSuscription };