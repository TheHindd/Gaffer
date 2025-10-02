import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate tokens
        const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            accessToken,
            refreshToken,
            user: { id: user._id, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
    const { userId, newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { password: hashedPassword, mustChangePassword: false },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// LOGOUT
export const logout = async (req, res) => {
    // For JWT: client should delete token
    // Optionally store invalidated refresh tokens in DB/Redis
    res.status(200).json({ message: "Logged out successfully" });
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Refresh token required" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const accessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
};

// GET CURRENT USER
export const me = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // In real system, generate reset token + email it
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // TODO: send resetToken via email (Nodemailer)
        res.status(200).json({ message: "Password reset link sent", resetToken });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await UserModel.findByIdAndUpdate(
            decoded.id,
            { password: hashedPassword, mustChangePassword: false },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
};
