import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null }, // project room if present
  name: { type: String }, // for group chats or project name
  type: { type: String, enum: ["project", "group", "dm"], required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  meta: { type: Object, default: {} } // flexible place for extras (e.g., meeting info)
}, { timestamps: true });

// index to fetch rooms a user participates in quickly
chatRoomSchema.index({ members: 1 });

export default mongoose.model("ChatRoomModel", chatRoomSchema);
