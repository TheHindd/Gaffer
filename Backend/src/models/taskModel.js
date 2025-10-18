import mongoose from "mongoose";
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectModel", default: null }, // null => personal note
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: false },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  status: { type: String, enum: ["todo", "in_progress", "done"], default: "todo" },
  dueDate: { type: Date },
  weight: { type: Number, default: 1 }, // for weighted progress calc
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
  isPersonal: { type: Boolean, default: false }, // optional explicit flag
  reviewStatus: { type: String, enum: ['pending', 'accepted', 'rejected'],default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
  reviewedAt: Date,
  reviewNotes: String
}, { timestamps: true });
  // Helpful indexes for dashboard and queries
  TaskSchema.index({ assignee: 1, dueDate: 1 });
  TaskSchema.index({ project: 1, status: 1 });
  TaskSchema.index({ dueDate: 1 });
  export default mongoose.model("TaskModel", TaskSchema);