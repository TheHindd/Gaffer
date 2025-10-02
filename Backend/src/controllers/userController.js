import UserModel from "../models/userModels.js";
import bcrypt from "bcryptjs";


// Create new user (Admin)

export const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Update user (Admin)

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    try {
        const updateFields = { name, email, role };

        if (password) {
            updateFields.password = await bcrypt.hash(password, 10);
        }

        const user = await UserModel.findByIdAndUpdate(id, updateFields, { new: true }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Delete user (Admin)

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await UserModel.findByIdAndDelete(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get all users (Admin & Manager)

export const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get user by ID (Admin & Manager)

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await UserModel.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get user by name (Admin & Manager)

export const getUserByName = async (req, res) => {
    const { name } = req.params;
    try {
        const users = await UserModel.find({ name: new RegExp(name, "i") }).select("-password");

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
