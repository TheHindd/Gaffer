import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'medium' },
    dueDate: { type: Date },
    reviewStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true });