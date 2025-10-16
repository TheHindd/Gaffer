import mongoose from "mongoose";
import ProjectModel from "../models/projectModel.js";
import ProjectMemberModel from "../models/projectMemberModel.js";
import ChatRoomModel from "../models/chatRoomModel.js";
import ActivityLogModel from "../models/activityLogModel.js";
import TaskModel from "../models/taskModel.js";
import FileModel from "../models/filesModel.js";
import NotificationModel from "../models/notificationModel.js";

// ============================================
// CREATE PROJECT (Manager/Admin)
// ============================================
export const createProject = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { title, description, startDate, endDate, memberIds = [] } = req.body;

    if (!title) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "endDate cannot be before startDate" });
    }

    // Unique title check
    const existing = await ProjectModel.findOne({ title }).session(session);
    if (existing) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "Project title must be unique" });
    }

    // Create project
    const createdArr = await ProjectModel.create(
      [
        {
          title,
          description,
          startDate,
          endDate,
          createdBy: req.user._id,
          status: "active"
        }
      ],
      { session }
    );

    const project = createdArr[0];

    // Prepare members (dedupe, ensure creator is included as lead)
    const deduped = Array.from(
      new Set([req.user._id.toString(), ...memberIds.map(String)])
    );
    
    const membersToInsert = deduped.map(userId => ({
      project: project._id,
      user: new mongoose.Types.ObjectId(userId),
      roleInProject: userId === req.user._id.toString() ? "lead" : "member",
      canCreateTasks: false
    }));

    if (membersToInsert.length) {
      await ProjectMemberModel.insertMany(membersToInsert, { session });
    }

    // Create chat room for the project with project title as name
    const memberObjectIds = membersToInsert.map(m => m.user);
    const chatArr = await ChatRoomModel.create(
      [
        {
          project: project._id,
          name: title, // Auto-generate from project name
          type: "project",
          members: memberObjectIds,
          createdBy: req.user._id
        }
      ],
      { session }
    );

    // Create activity log
    if (ActivityLogModel) {
      await ActivityLogModel.create(
        [
          {
            project: project._id,
            userId: req.user._id,
            action: "project_created",
            details: `Project "${title}" created`,
            metadata: { title }
          }
        ],
        { session }
      );
    }

    // Send notifications to added members
    const notificationsToCreate = memberIds
      .filter(id => id !== req.user._id.toString())
      .map(userId => ({
        userId: new mongoose.Types.ObjectId(userId),
        type: "project_assigned",
        message: `You have been added to project "${title}"`,
        project: project._id,
        read: false
      }));

    if (notificationsToCreate.length && NotificationModel) {
      await NotificationModel.insertMany(notificationsToCreate, { session });
    }

    await session.commitTransaction();
    session.endSession();

    const populatedProject = await ProjectModel.findById(project._id)
      .populate("createdBy", "name email")
      .lean();

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: populatedProject,
      chatRoom: chatArr[0]
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("createProject error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ============================================
// GET PROJECTS FOR CURRENT USER
// ============================================
export const getProjectsForUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "20", 10);
    const status = req.query.status;
    const skip = (page - 1) * limit;

    // Admin sees all projects
    if (req.user.role === "admin") {
      const filter = status ? { status } : {};
      const projects = await ProjectModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "name email")
        .lean();

      const total = await ProjectModel.countDocuments(filter);

      return res.status(200).json({
        success: true,
        count: projects.length,
        total,
        page,
        projects
      });
    }

    // Non-admin users see only projects they're members of
    const memberEntries = await ProjectMemberModel.find({ user: req.user._id })
      .select("project")
      .lean();
    const projectIds = memberEntries.map(m => m.project);

    const filter = { _id: { $in: projectIds } };
    if (status) filter.status = status;

    const projects = await ProjectModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email")
      .lean();

    const total = await ProjectModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      page,
      projects
    });
  } catch (error) {
    console.error("getProjectsForUser error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ============================================
// GET PROJECT DETAILS (with Kanban, Tasks, Files, etc.)
// ============================================
export const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid project ID" });
    }

    const project = await ProjectModel.findById(projectId)
      .populate("createdBy", "name email")
      .lean();

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Permission check: admin or project member
    if (req.user.role !== "admin") {
      const isMember = await ProjectMemberModel.exists({
        project: projectId,
        user: userId
      });
      if (!isMember) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied - not a project member" });
      }
    }

    // Fetch all related data in parallel
    const [tasks, files, members, activity, chatRoom] = await Promise.all([
      TaskModel.find({ project: projectId })
        .populate("assignee", "name email")
        .populate("createdBy", "name email")
        .lean(),
      FileModel.find({ project: projectId })
        .populate("uploadedBy", "name email")
        .lean(),
      ProjectMemberModel.find({ project: projectId })
        .populate("user", "name email role")
        .lean(),
      ActivityLogModel
        ? ActivityLogModel.find({ project: projectId })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate("userId", "name email")
            .lean()
        : Promise.resolve([]),
      ChatRoomModel.findOne({ project: projectId })
        .populate("members", "name email")
        .lean()
    ]);

    // Organize tasks into Kanban board (personal tasks only for current user)
    const userTasks = tasks.filter(
      t => t.assignee && String(t.assignee._id) === String(userId)
    );

    const kanban = {
      todo: userTasks.filter(t => t.status === "todo"),
      in_progress: userTasks.filter(t => t.status === "in_progress"),
      done: userTasks.filter(t => t.status === "done")
    };

    // Calculate progress percentages (weighted by weight field)
    const totalWeight = tasks.reduce((sum, t) => sum + (t.weight || 1), 0) || 0;
    const completedWeight = tasks
      .filter(t => t.status === "done")
      .reduce((sum, t) => sum + (t.weight || 1), 0);
    const projectProgress =
      totalWeight === 0 ? 0 : Math.round((completedWeight / totalWeight) * 100);

    const userTotalWeight =
      userTasks.reduce((s, t) => s + (t.weight || 1), 0) || 0;
    const userCompletedWeight = userTasks
      .filter(t => t.status === "done")
      .reduce((s, t) => s + (t.weight || 1), 0);
    const userProgress =
      userTotalWeight === 0
        ? 0
        : Math.round((userCompletedWeight / userTotalWeight) * 100);

    // Format team tasks (all tasks, not just user's)
    const teamTasks = tasks.map(t => ({
      id: t._id,
      title: t.title,
      description: t.description,
      assignee: t.assignee,
      priority: t.priority,
      status: t.status,
      dueDate: t.dueDate,
      reviewStatus: t.reviewStatus,
      weight: t.weight || 1,
      createdBy: t.createdBy
    }));

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
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ============================================
// UPDATE PROJECT (Manager only)
// ============================================
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, startDate, endDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid project ID" });
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Permission check: only project creator or admin
    if (
      project.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Only project manager can update" });
    }

    // If title changed, ensure uniqueness
    if (title && title !== project.title) {
      const existing = await ProjectModel.findOne({ title });
      if (existing) {
        return res
          .status(400)
          .json({ success: false, message: "Title already in use" });
      }
      project.title = title;
    }

    if (description !== undefined) project.description = description;
    if (status) project.status = status;
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;

    await project.save();

    // Log activity
    if (ActivityLogModel) {
      await ActivityLogModel.create({
        project: projectId,
        userId: req.user._id,
        action: "project_updated",
        details: `Project updated`,
        metadata: { updatedFields: Object.keys(req.body) }
      });
    }

    const updated = await ProjectModel.findById(projectId)
      .populate("createdBy", "name email")
      .lean();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updated
    });
  } catch (error) {
    console.error("updateProject error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ============================================
// ARCHIVE PROJECT (Manager only)
// ============================================
export const archiveProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid project ID" });
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Permission check
    if (
      project.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only project manager can archive"
        });
    }

    project.status = "archived";
    await project.save();

    // Log activity
    if (ActivityLogModel) {
      await ActivityLogModel.create({
        project: projectId,
        userId: req.user._id,
        action: "project_archived",
        details: `Project archived`
      });
    }

    res.status(200).json({
      success: true,
      message: "Project archived successfully",
      project
    });
  } catch (error) {
    console.error("archiveProject error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ============================================
// DELETE PROJECT (Admin only)
// ============================================
export const deleteProject = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "Invalid project ID" });
    }

    // Permission: only admin
    if (req.user.role !== "admin") {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(403)
        .json({ success: false, message: "Only admins can delete projects" });
    }

    const project = await ProjectModel.findByIdAndDelete(projectId).session(
      session
    );
    if (!project) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Delete all related data
    await Promise.all([
      ProjectMemberModel.deleteMany({ project: projectId }).session(session),
      ChatRoomModel.deleteMany({ project: projectId }).session(session),
      TaskModel.deleteMany({ project: projectId }).session(session),
      FileModel.deleteMany({ project: projectId }).session(session),
      ActivityLogModel
        ? ActivityLogModel.deleteMany({ project: projectId }).session(session)
        : Promise.resolve(),
      NotificationModel
        ? NotificationModel.deleteMany({ project: projectId }).session(session)
        : Promise.resolve()
    ]);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Project and all related data deleted successfully"
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("deleteProject error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ============================================
// GET DASHBOARD (Upcoming Tasks & Personal Notes)
// ============================================
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const upcomingLimit = Number(req.query.limit) || 10;

    // Upcoming tasks (not done, with due date, sorted by due date)
    const upcomingTasks = await TaskModel.find({
      assignee: userId,
      status: { $ne: "done" },
      dueDate: { $exists: true, $ne: null }
    })
      .sort({ dueDate: 1 })
      .limit(upcomingLimit)
      .populate("project", "title")
      .populate("assignee", "name email")
      .lean();

    // Personal notes (tasks with no project)
    const personalNotes = await TaskModel.find({
      $or: [{ project: null }, { project: { $exists: false } }],
      createdBy: userId
    })
      .sort({ updatedAt: -1 })
      .lean();

    // Count overdue tasks
    const overdueCount = await TaskModel.countDocuments({
      assignee: userId,
      status: { $ne: "done" },
      dueDate: { $lt: new Date() }
    });

    // Get user's project progress
    const memberProjects = await ProjectMemberModel.find({
      user: userId
    }).select("project");
    const projectIds = memberProjects.map(m => m.project);

    const recentProjects = await ProjectModel.find({
      _id: { $in: projectIds },
      status: "active"
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      upcomingTasks,
      personalNotes,
      recentProjects,
      summary: {
        upcomingCount: upcomingTasks.length,
        overdueCount,
        projectCount: projectIds.length
      }
    });
  } catch (error) {
    console.error("getDashboard error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ============================================
// ADD TEAM MEMBER TO PROJECT (Manager only)
// ============================================
export const addTeamMember = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid project ID" });
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Permission: only project creator
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only project manager can add members"
        });
    }

    // Check if already a member
    const existing = await ProjectMemberModel.findOne({
      project: projectId,
      user: userId
    });

    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "User is already a member" });
    }

    // Add member
    const newMember = new ProjectMemberModel({
      project: projectId,
      user: userId,
      roleInProject: "member",
      canCreateTasks: false
    });

    await newMember.save();

    // Add to chat room
    const chatRoom = await ChatRoomModel.findOne({ project: projectId });
    if (chatRoom && !chatRoom.members.includes(userId)) {
      chatRoom.members.push(userId);
      await chatRoom.save();
    }

    // Send notification
    if (NotificationModel) {
      await NotificationModel.create({
        userId,
        type: "project_assigned",
        message: `You have been added to project "${project.title}"`,
        project: projectId,
        read: false
      });
    }

    // Log activity
    if (ActivityLogModel) {
      await ActivityLogModel.create({
        project: projectId,
        userId: req.user._id,
        action: "member_added",
        details: `Team member added to project`
      });
    }

    res.status(201).json({
      success: true,
      message: "Team member added successfully",
      member: newMember
    });
  } catch (error) {
    console.error("addTeamMember error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ============================================
// GRANT ASSISTANT ACCESS (Manager only)
// ============================================
export const grantAssistantAccess = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid project ID" });
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Permission: only project creator
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only project manager can grant assistant access"
        });
    }

    // Check if user is a project member
    const projectMember = await ProjectMemberModel.findOne({
      project: projectId,
      user: userId
    });

    if (!projectMember) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User is not a member of this project"
        });
    }

    // Grant assistant access
    projectMember.canCreateTasks = true;
    await projectMember.save();

    // Send notification
    if (NotificationModel) {
      await NotificationModel.create({
        userId,
        type: "assistant_granted",
        message: `You have been granted assistant access on project "${project.title}"`,
        project: projectId,
        read: false
      });
    }

    // Log activity
    if (ActivityLogModel) {
      await ActivityLogModel.create({
        project: projectId,
        userId: req.user._id,
        action: "assistant_granted",
        details: `Assistant access granted to team member`
      });
    }

    res.status(200).json({
      success: true,
      message: "Assistant access granted successfully",
      member: projectMember
    });
  } catch (error) {
    console.error("grantAssistantAccess error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ============================================
// REVOKE ASSISTANT ACCESS (Manager only)
// ============================================
export const revokeAssistantAccess = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid project ID" });
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Permission: only project creator
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only project manager can revoke assistant access"
        });
    }

    // Find and revoke
    const projectMember = await ProjectMemberModel.findOne({
      project: projectId,
      user: userId
    });

    if (!projectMember) {
      return res
        .status(400)
        .json({ success: false, message: "User is not a member" });
    }

    projectMember.canCreateTasks = false;
    await projectMember.save();

    // Send notification
    if (NotificationModel) {
      await NotificationModel.create({
        userId,
        type: "assistant_revoked",
        message: `Your assistant access has been revoked on project "${project.title}"`,
        project: projectId,
        read: false
      });
    }

    // Log activity
    if (ActivityLogModel) {
      await ActivityLogModel.create({
        project: projectId,
        userId: req.user._id,
        action: "assistant_revoked",
        details: `Assistant access revoked from team member`
      });
    }

    res.status(200).json({
      success: true,
      message: "Assistant access revoked successfully",
      member: projectMember
    });
  } catch (error) {
    console.error("revokeAssistantAccess error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};