import mongoose from "mongoose";

export const ActivityLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    details: { type: String },
}, { timestamps: true});


export default mongoose.model("ActivityLogModel", ActivityLogSchema);