import mongoose from "mongoose";

export const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true },
    type: { 
        type: String, 
        enum: [
            'project_assigned',
            'task_assigned', 
            'task_reassigned',
            'task_reviewed',
            'mentioned_in_chat',
            'assistant_granted',
            'assistant_revoked'
        ],
        required: true 
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    
    // Links to related entities
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectModel' },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskModel' },
    chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoomModel' },
    
    // Optional metadata
    metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export default mongoose.model("NotificationModel", notificationSchema);