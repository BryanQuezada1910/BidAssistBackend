import bcrypt from 'bcrypt';
import User from "../models/User.js";

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

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

const updateUser = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "ID is required" });
    }

    if (!req.body) {
        return res.status(400).json({ message: 'The body of the request is empty' });
    }

    const { name, lastname, username, email } = req.body;

    if (!name || !lastname || !username || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        if (await User.findOne({ username })) {
            return res.status(400).json({ message: "User Already Exist" });
        }

        if (await User.findOne({ email })) {
            return res.status(404).json({ message: "The Email Has Already Been Taken" });
        }

        const user = await User.findByIdAndUpdate(id, {
            name: name,
            lastname: lastname,
            username: username,
            email: email
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

export { getAllUsers, getUserById, deleteUser, updateUser };