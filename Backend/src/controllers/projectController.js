import mongoose from "mongoose";
import ProjectModel from "../models/Project.js";
import ProjectMemberModel from "../models/ProjectMember.js";
import ChatRoomModel from "../models/ChatRoom.js";
import ActivityLogModel from "../models/ActivityLog.js"; // if you have it
import TaskModel from "../models/Task.js";
import FileModel from "../models/File.js";

export const createProject = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { title, description, startDate, endDate, memberIds = [] } = req.body;

    if (!title) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Title is required" });
    }

    // optional: validate date ordering
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "end Date cannot be before start Date" });
    }

    // Unique title check (a unique index is better)
    const existing = await ProjectModel.findOne({ title }).session(session);
    if (existing) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Project title must be unique" });
    }

    const newProject = await ProjectModel.create([{
      title,
      description,
      startDate,
      endDate,
      createdBy: req.user._id
    }], { session });

    const project = newProject[0];

    // create project members (ensure unique)
    const membersToInsert = Array.from(new Set([req.user._id.toString(), ...memberIds])).map(userId => ({
      project: project._id,
      user: userId,
      roleInProject: userId === req.user._id.toString() ? "lead" : "member"
    }));

    if (membersToInsert.length) {
      await ProjectMemberModel.insertMany(membersToInsert, { session });
    }

    // create project chat room
    const memberObjectIds = membersToInsert.map(m => mongoose.Types.ObjectId(m.user));
    const chatRoom = await ChatRoomModel.create([{
      project: project._id,
      name: title,
      type: "project",
      members: memberObjectIds,
      createdBy: req.user._id
    }], { session });

    // optional: activity log
    // await ActivityLogModel.create([{ project: project._id, actor: req.user._id, action: "project_created", meta: { title } }], { session });

    await session.commitTransaction();
    session.endSession();

    // populate response
    const created = await ProjectModel.findById(project._id)
      .populate({ path: 'createdBy', select: 'name email' })
      .lean();

    res.status(201).json({ message: "Project created", project: created, chatRoom: chatRoom[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("createProject error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProjectsForUser = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    if (req.user.role === "admin") {
      // admin sees all, optionally filter by status
      const filter = status ? { status } : {};
      const projects = await ProjectModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate('createdBy', 'name email')
        .lean();
      return res.json({ projects });
    }

    // get projects where user is a member
    const memberEntries = await ProjectMemberModel.find({ user: req.user._id }).select('project').lean();
    const projectIds = memberEntries.map(m => m.project);

    const filter = { _id: { $in: projectIds } };
    if (status) filter.status = status;

    const projects = await ProjectModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .populate('createdBy', 'name email')
      .lean();

    res.status(200).json({ projects });
  } catch (error) {
    console.error("getProjectsForUser error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await ProjectModel.findById(projectId)
      .populate('createdBy', 'name email')
      .lean();
    if (!project) return res.status(404).json({ message: "Project not found" });

    // check membership if not admin
    if (req.user.role !== 'admin') {
      const isMember = await ProjectMemberModel.exists({ project: project._id, user: req.user._id });
      if (!isMember) return res.status(403).json({ message: "Access denied" });
    }

    const members = await ProjectMemberModel.find({ project: project._id }).populate('user', 'name email role').lean();
    const tasks = await TaskModel.find({ project: project._id }).populate('assignee', 'name email').lean();
    const files = await FileModel.find({ project: project._id }).populate('uploadedBy', 'name email').lean();
    const chatRoom = await ChatRoomModel.findOne({ project: project._id }).lean();

    // compute basic progress: completed tasks / total
    const totalTasks = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const progressPercent = totalTasks === 0 ? 0 : Math.round((completed / totalTasks) * 100);

    res.status(200).json({
      project,
      members,
      tasks,
      files,
      chatRoom,
      progressPercent
    });
  } catch (error) {
    console.error("getProjectById error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { title, description, status, startDate, endDate } = req.body;

  try {
    const project = await ProjectModel.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // membership check: only manager/lead or admin should be allowed
    // add your role check logic here (e.g., check req.user role or project membership)

    // if title changed, ensure uniqueness
    if (title && title !== project.title) {
      const existing = await ProjectModel.findOne({ title });
      if (existing) return res.status(400).json({ message: "Title already used" });
      project.title = title;
    }

    if (description !== undefined) project.description = description;
    if (status) project.status = status;
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;

    await project.save();
    res.status(200).json({ message: "Project updated", project });
  } catch (error) {
    console.error("updateProject error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const archiveProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await ProjectModel.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // optional permission check

    project.status = "archived";
    await project.save();

    // optionally notify members, archive tasks, etc.
    res.status(200).json({ message: "Project archived", project });
  } catch (error) {
    console.error("archiveProject error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

projectSchema.index({ title: 1 }, { unique: true });

export default mongoose.model("ProjectModel", projectSchema);
