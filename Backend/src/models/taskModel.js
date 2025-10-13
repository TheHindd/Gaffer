import mongoose from "mongoose";

const todoschema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});


const taskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectModel", required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" }, // nullable until assigned
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
  attachments: [{ type: String }], // array of file URLs or paths
  dueDate: { type: Date },
  weight: { type: Number, default: 0 }, // optional for weighted progress
  // simple audit
  todoChecklist: [todoschema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
}, { timestamps: true });

taskSchema.index({ project: 1, assignee: 1 });
taskSchema.index({ dueDate: 1 });

export default mongoose.model("TaskModel", taskSchema);
