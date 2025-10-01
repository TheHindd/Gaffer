import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, default: "" },
  attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }], // file pointers
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // users mentioned
  edited: { type: Boolean, default: false },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // optional read receipts
}, { timestamps: true });

// commonly query messages by room and time
messageSchema.index({ room: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);
