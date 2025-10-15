import mongoose from "mongoose";
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: "" },
  startDate: { type: Date },
  endDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
  status: { type: String, enum: ["active","completed" ,"archived"], default: "active" },
  meta: { type: mongoose.Schema.Types.Mixed }, // optional free metadata
}, { timestamps: true });
  // Indexes
  ProjectSchema.index({ title: 1 }, { unique: true });
  ProjectSchema.index({ createdBy: 1 });
 export default mongoose.model("ProjectModel", ProjectSchema);
