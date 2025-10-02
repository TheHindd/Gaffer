import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // nullable until assigned
  status: {
    type: String,
    enum: ["todo", "in_progress", "done"],
    default: "todo"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium"
  },
  dueDate: { type: Date },
  weight: { type: Number, default: 1 }, // optional for weighted progress
  // simple audit
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

taskSchema.index({ project: 1, assignee: 1 });
taskSchema.index({ dueDate: 1 });

export default mongoose.model("TaskModel", taskSchema);
