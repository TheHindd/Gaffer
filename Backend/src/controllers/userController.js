import User from "../models/userModels.js";

// Create new user (Admin only)
export const createUser = async (req, res) => {

    const { name, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = new User({ name, email, password, role });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//update user (Admin only)
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            id,
            { name, email, role },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete user (Admin only)
export const deleteUser = async (req,res) => {
    const {id} = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
};

// Get all users (Admin and Manager)
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }};

// Get user by ID (Admin and Manager)
export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }       
};

// Get user by name (Admin and Manager)
export const getUserByName = async (req, res) => {
    const { name } = req.params;    
    try {
        const users = await User.find({ name: new RegExp(name, 'i') }).select("-password");
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }};