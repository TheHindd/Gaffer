import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  status: {
    type: String,
    enum: ["active", "completed", "archived"],
    default: "active"
  },
  startDate: { type: Date },
  endDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // optional cached summary fields (helpful for UI)
  cachedProgressPercent: { type: Number, default: 0 }, // can be recomputed server-side
}, { timestamps: true });

projectSchema.index({ createdBy: 1 });
projectSchema.index({ status: 1 });

export default mongoose.model("Project", projectSchema);
