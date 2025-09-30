import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);