import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filepath: { type: String, required: true }, // or cloud URL
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model("File", fileSchema);
