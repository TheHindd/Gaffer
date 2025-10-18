import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectModel', required: true }, // ✅ Add this
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true },
    action: { 
        type: String, 
        enum: [
            'project_created',
            'member_added',
            'member_removed',
            'task_created',
            'task_updated',
            'task_deleted',
            'file_uploaded',
            'file_deleted',
            'status_changed'
        ],
        required: true 
    },
    target: { type: String }, // e.g., "Task:12345" or "File:abc"
    details: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed } // flexible for extra data
}, { timestamps: true });

ActivityLogSchema.index({ project: 1, createdAt: -1 });

export default mongoose.model("ActivityLogModel", ActivityLogSchema);