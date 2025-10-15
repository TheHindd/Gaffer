import mongoose from "mongoose";
import ProjectModel from "../models/projectModel.js";
import ProjectMemberModel from "../models/projectMemberModel.js";
import ChatRoomModel from "../models/chatRoomModel.js";
import ActivityLogModel from "../models/activityLogModel.js"; // optional
import TaskModel from "../models/taskModel.js";
import FileModel from "../models/filesModel.js";


//Create project (transactional): create Project, ProjectMembers, ChatRoom

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

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "endDate cannot be before startDate" });
    }

    // Unique title check (DB unique index advised)
    const existing = await ProjectModel.findOne({ title }).session(session);
    if (existing) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Project title must be unique" });
    }

    const createdArr = await ProjectModel.create([{
      title,
      description,
      startDate,
      endDate,
      createdBy: req.user._id
    }], { session });

    const project = createdArr[0];

    // Prepare members (dedupe, ensure lead included)
    const deduped = Array.from(new Set([req.user._id.toString(), ...memberIds.map(String)]));
    const membersToInsert = deduped.map(userId => ({
      project: mongoose.Types.ObjectId(project._id),
      user: mongoose.Types.ObjectId(userId),
      roleInProject: userId === req.user._id.toString() ? "lead" : "member"
    }));

    if (membersToInsert.length) {
      await ProjectMemberModel.insertMany(membersToInsert, { session });
    }

    // create chatroom for the project
    const memberObjectIds = membersToInsert.map(m => mongoose.Types.ObjectId(m.user));
    const chatArr = await ChatRoomModel.create([{
      project: project._id,
      name: title,
      type: "project",
      members: memberObjectIds,
      createdBy: req.user._id
    }], { session });

    // optional activity log (guard if model exists)
    if (ActivityLogModel) {
      await ActivityLogModel.create([{ project: project._id, actor: req.user._id, action: "project_created", meta: { title } }], { session });
    }

    await session.commitTransaction();
    session.endSession();

    const created = await ProjectModel.findById(project._id)
      .populate({ path: 'createdBy', select: 'name email' })
      .lean();

    res.status(201).json({ success: true, message: "Project created", project: created, chatRoom: chatArr[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("createProject error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


//Get projects visible to current user (admin sees all)

export const getProjectsForUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "20", 10);
    const status = req.query.status;
    const skip = (page - 1) * limit;

    if (req.user.role === "admin") {
      const filter = status ? { status } : {};
      const projects = await ProjectModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email')
        .lean();
      return res.status(200).json({ success: true, count: projects.length, projects });
    }

    // get project IDs where user is a member
    const memberEntries = await ProjectMemberModel.find({ user: req.user._id }).select('project').lean();
    const projectIds = memberEntries.map(m => m.project);

    const filter = { _id: { $in: projectIds } };
    if (status) filter.status = status;

    const projects = await ProjectModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email')
      .lean();

    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (error) {
    console.error("getProjectsForUser error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



// Get project details: kanban, team tasks, files, members, chatRoom, activity, progress

export const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: "Invalid project id" });
    }

    const project = await ProjectModel.findById(projectId).lean();
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    // permission: admin or project member
    if (req.user.role !== "admin") {
      const isMember = await ProjectMemberModel.exists({ project: project._id, user: userId });
      if (!isMember) return res.status(403).json({ success: false, message: "Access denied" });
    }

    const [tasks, files, members, activity, chatRoom] = await Promise.all([
      TaskModel.find({ project: project._id }).populate("assignee", "name email").lean(),
      FileModel.find({ project: project._id }).populate("uploadedBy", "name email").lean(),
      ProjectMemberModel.find({ project: project._id }).populate("user", "name email role").lean(),
      (ActivityLogModel ? ActivityLogModel.find({ project: project._id }).sort({ createdAt: -1 }).limit(50).lean() : Promise.resolve([])),
      ChatRoomModel.findOne({ project: project._id }).lean()
    ]);

    const kanban = {
      todo: tasks.filter(t => String(t.status).toLowerCase() === "todo"),
      in_progress: tasks.filter(t => String(t.status).toLowerCase() === "in_progress"),
      done: tasks.filter(t => String(t.status).toLowerCase() === "done")
    };

    const teamTasks = tasks.map(t => ({
      id: t._id,
      title: t.title,
      assignee: t.assignee || null,
      priority: t.priority,
      status: t.status,
      dueDate: t.dueDate,
      weight: t.weight || 1
    }));

    const totalWeight = tasks.reduce((sum, t) => sum + (t.weight || 1), 0) || 0;
    const completedWeight = tasks
      .filter(t => String(t.status).toLowerCase() === "done")
      .reduce((sum, t) => sum + (t.weight || 1), 0);
    const projectProgress = totalWeight === 0 ? 0 : Math.round((completedWeight / totalWeight) * 100);

    const userTasks = tasks.filter(t => t.assignee && String(t.assignee._id) === String(userId));
    const userTotalWeight = userTasks.reduce((s, t) => s + (t.weight || 1), 0) || 0;
    const userCompletedWeight = userTasks.filter(t => String(t.status).toLowerCase() === "done").reduce((s, t) => s + (t.weight || 1), 0);
    const userProgress = userTotalWeight === 0 ? 0 : Math.round((userCompletedWeight / userTotalWeight) * 100);

    res.status(200).json({
      success: true,
      project,
      kanban,
      teamTasks,
      files,
      members,
      chatRoom,
      activity,
      progress: {
        projectProgress,
        userProgress
      }
    });
  } catch (error) {
    console.error("getProjectDetails error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// Update project (partial updates). Permission checks should be added externally as needed.

export const updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { title, description, status, startDate, endDate } = req.body;

  try {
    const project = await ProjectModel.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

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
    res.status(200).json({ success: true, message: "Project updated", project });
  } catch (error) {
    console.error("updateProject error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


//Soft-archive a project

export const archiveProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await ProjectModel.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.status = "archived";
    await project.save();

    res.status(200).json({ success: true, message: "Project archived", project });
  } catch (error) {
    console.error("archiveProject error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// Dashboard: upcoming tasks and personal notes

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const upcomingLimit = Number(req.query.limit) || 10;

    const upcomingTasks = await TaskModel.find({
      assignee: userId,
      status: { $ne: "done" },
      dueDate: { $exists: true, $ne: null }
    })
      .sort({ dueDate: 1 })
      .limit(upcomingLimit)
      .populate("project", "title")
      .lean();

    const personalNotes = await TaskModel.find({
      $or: [{ project: null }, { project: { $exists: false } }],
      createdBy: userId
    })
      .sort({ updatedAt: -1 })
      .lean();

    const overdueCount = await TaskModel.countDocuments({
      assignee: userId,
      status: { $ne: "done" },
      dueDate: { $lt: new Date() }
    });

    res.status(200).json({
      success: true,
      upcomingTasks,
      personalNotes,
      summary: { upcomingCount: upcomingTasks.length, overdueCount }
    });
  } catch (error) {
    console.error("getDashboard error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


//Grant assistant access for a user within a project (manager only)

export const grantAssistantAccess = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    const project = await ProjectModel.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (String(project.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Only managers can assign assistants" });
    }

    // ensure teamMembers exists and compare as strings
    const projectTeam = (project.teamMembers || []).map(String);
    if (!projectTeam.includes(String(userId))) {
      return res.status(400).json({ message: "User is not part of this project" });
    }

    project.assistants = project.assistants || [];
    if (!project.assistants.map(String).includes(String(userId))) {
      project.assistants.push(mongoose.Types.ObjectId(userId));
      await project.save();
    }

    res.status(200).json({ success: true, message: "Assistant access granted", assistants: project.assistants });
  } catch (error) {
    console.error("grantAssistantAccess error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

//delete project 

export const deleteProject = async (req, res) => {
  
  const { projectId } = req.params;

  try {
    const project = await ProjectModel.findByIdAndDelete(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });  
    await ProjectMemberModel.deleteMany({ project: projectId });
    await ChatRoomModel.deleteMany({ project: projectId });
    await TaskModel.deleteMany({ project: projectId });
    await FileModel.deleteMany({ project: projectId });
    if (ActivityLogModel) {
      await ActivityLogModel.deleteMany({ project: projectId });
    }
    res.status(200).json({ success: true, message: "Project and related data deleted" });
    
  } catch (error) {
  
    res.status(500).json({ success: false, message: "Server error", error: error.message });
    
  }
}