import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  // For MVP you can store a local path; later this can be a cloud URL
  storagePath: { type: String, required: true },
  mimeType: { type: String, required: true },
  sizeBytes: { type: Number, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Link to project (required) and optional to a task (if file belongs to a task)
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", default: null },

  // optional: flag if uploaded via chat (and message id stored on Message.attachments)
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

fileSchema.index({ project: 1, task: 1 });
fileSchema.index({ uploadedBy: 1 });

export default mongoose.model("File", fileSchema);
