import File from "../models/fileModel.js";
import fs from "fs";
import path from "path";

// ✅ Upload file (metadata is saved after multer stores the file)
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = new File({
      filename: req.file.originalname,
      filepath: req.file.path, // location on disk (or cloud URL later)
      uploadedBy: req.user.id, // from auth middleware
      project: req.body.projectId || null,
      task: req.body.taskId || null,
    });

    await file.save();
    res.status(201).json({ message: "File uploaded successfully", file });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ List files for a project or task
export const listFiles = async (req, res) => {
  try {
    const { projectId, taskId } = req.query;
    const query = {};
    if (projectId) query.project = projectId;
    if (taskId) query.task = taskId;

    const files = await File.find(query).populate("uploadedBy", "name email");
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Download file
export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    res.download(path.resolve(file.filepath), file.filename);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete file
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    // delete from storage
    fs.unlinkSync(file.filepath);

    // delete metadata
    await file.deleteOne();

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
