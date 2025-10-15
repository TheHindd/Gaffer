import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, unique: true },
  description: { type: String, default: "" },
  status: {
    type: String,
    enum: ["active", "completed", "archived"],
    default: "active"
  },
  assistants: [  {    type: mongoose.Schema.Types.ObjectId,    ref: "User",  },],
  startDate: { type: Date },
  endDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  // optional cached summary fields (helpful for UI)
  cachedProgressPercent: { type: Number, default: 0 }, // can be recomputed server-side
}, { timestamps: true });

projectSchema.index({ createdBy: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ title: 1 }, { unique: true });

export default mongoose.model("ProjectModel", projectSchema);
