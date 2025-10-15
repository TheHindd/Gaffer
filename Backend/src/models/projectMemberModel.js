import mongoose from "mongoose";

const projectMemberSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  roleInProject: { type: String, enum: ["lead", "member"], default: "member" },
  canCreateTasks: { type: Boolean, default: false }, // ✅ Assistant permission
  joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// ensure uniqueness: a user can only appear once per project
projectMemberSchema.index({ project: 1, user: 1 }, { unique: true });

export default mongoose.model("ProjectMemberModel", projectMemberSchema);
