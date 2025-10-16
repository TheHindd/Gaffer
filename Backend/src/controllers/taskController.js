import TaskModel from "../models/taskModel.js";
import ProjectModel from "../models/projectModel.js";
import ProjectMemberModel from "../models/projectMemberModel.js";
import ActivityLogModel from "../models/activityLogModel.js";
import NotificationModel from "../models/notificationModel.js";

// ============================================
// CREATE TASK (Manager or Assistant)
// ============================================
export const createTask = async (req, res) => {
  try {
    const { title, description, project, assignee, priority, dueDate, weight } = req.body;

    // Validate required fields
    if (!title || !project || !assignee) {
      return res.status(400).json({
        success: false,
        message: "Title, project, and assignee are required"
      });
    }

    // Validate project exists
    const projectDoc = await ProjectModel.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Permission check: Only creator (manager) or assistant can create tasks
    const isCreator = projectDoc.createdBy.toString() === req.user._id.toString();

    const memberRecord = await ProjectMemberModel.findOne({
      project,
      user: req.user._id
    });

    const canCreateTasks = memberRecord?.canCreateTasks || false;

    if (!isCreator && !canCreateTasks) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to create tasks in this project"
      });
    }

    // Validate assignee is a project member
    const assigneeMember = await ProjectMemberModel.findOne({
      project,
      user: assignee
    });

    if (!assigneeMember) {
      return res.status(400).json({
        success: false,
        message: "Assignee is not a member of this project"
      });
    }

    // Create task
    const newTask = new TaskModel({
      title,
      description: description || "",
      project,
      assignee,
      priority: priority || "medium",
      dueDate: dueDate || null,
      weight: weight || 1,
      status: "todo",
      createdBy: req.user._id,
      isPersonal: false,
      reviewStatus: null
    });

    await newTask.save();

    // Populate for response
    const savedTask = await TaskModel.findById(newTask._id)
      .populate("assignee", "name email")
      .populate("createdBy", "name email")
      .lean();

    // Send notification to assignee
    if (NotificationModel) {
      await NotificationModel.create({
        userId: assignee,
        type: "task_assigned",
        message: `You have been assigned a new task: "${title}"`,
        project,
        task: newTask._id,
        read: false
      });
    }

    // Log activity
    if (ActivityLogModel) {
      await ActivityLogModel.create({
        project,
        userId: req.user._id,
        action: "task_created",
        details: `Task "${title}" created`,
        metadata: { taskId: newTask._id, title, assignee }
      });
    }

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: savedTask
    });
  } catch (error) {
    console.error("createTask error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ============================================
// GET TASKS FOR A PROJECT
// ============================================
export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, assignee, priority } = req.query;

    // Build filter
    const filter = { project: projectId };
    if (status) filter.status = status;
    if (assignee) filter.assignee = assignee;
    if (priority) filter.priority = priority;

    const tasks = await TaskModel.find(filter)
      .populate("assignee", "name email")
      .populate("createdBy", "name email")
      .sort({ dueDate: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error("getProjectTasks error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ============================================
// GET SINGLE TASK
// ============================================
export const getTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await TaskModel.findById(taskId)
      .populate("assignee", "name email")
      .populate("createdBy", "name email")
      .populate("reviewedBy", "name email")
      .lean();

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    console.error("getTask error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ============================================
// UPDATE TASK STATUS (Assignee or Manager)
// ============================================
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!["todo", "in_progress", "done"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: todo, in_progress, or done"
      });
    }

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Permission: assignee or project manager
    const project = await ProjectModel.findById(task.project);
    const isManager = project.createdBy.toString() === req.user._id.toString();
    const isAssignee = task.assignee.toString() === req.user._id.toString();

    if (!isManager && !isAssignee) {
      return res.status(403).json({
        success: false,
        message: "Only assignee or manager can update task status"
      });
    }

    const oldStatus = task.status;
    task.status = status;
    await task.save();

    // Log activity
    if (ActivityLogModel) {
      await ActivityLogModel.create({
        project: task.project,
        userId: req.user._id,
        action: "status_changed",
        details: `Task status changed from ${oldStatus} to ${status}`,
        metadata: { taskId, oldStatus, newStatus: status }
      });
    }

    const updated = await TaskModel.findById(taskId)
      .populate("assignee", "name email")
      .lean();

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task: updated
    });
  } catch (error) {
    console.error("updateTaskStatus error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ============================================
// UPDATE TASK DETAILS (Manager only)
// ============================================
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, assignee, priority, dueDate, weight } = req.body;

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Permission: only project manager
    const project = await ProjectModel.findById(task.project);
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only project manager can edit task details"
      });
    }

    // If reassigning, validate new assignee is a project member
    if (assignee && assignee !== task.assignee.toString()) {
      const newAssignee = await ProjectMemberModel.findOne({
        project: task.project,
        user: assignee
      });

      if (!newAssignee) {
        return res.status(400).json({
          success: false,
          message: "New assignee is not a member of this project"
        });
      }

      task.assignee = assignee;

      // Send notification to new assignee
      if (NotificationModel) {
        await NotificationModel.create({
          userId: assignee,
          type: "task_reassigned",
          message: `Task "${task.title}" has been reassigned to you`,
          project: task.project,
          task: taskId,
          read: false
        });
      }
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (weight) task.weight = weight;

    await task.save();

    // Log activity
    if (ActivityLogModel) {
      await ActivityLogModel.create({
        project: task.project,
        userId: req.user._id,
        action: "task_updated",
        details: `Task updated`,
        metadata: { taskId, updatedFields: Object.keys(req.body) }
      });
    }

    const updated = await TaskModel.findById(taskId)
      .populate("assignee", "name email")
      .lean();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updated
    });
  } catch (error) {
    console.error("updateTask error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ============================================
// REVIEW TASK (Manager accepts/rejects)
// ============================================
export const reviewTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { reviewStatus, reviewNotes } = req.body;

    if (!["accepted", "rejected"].includes(reviewStatus)) {
      return res.status(400).json({
        success: false,
        message: "Review status must be 'accepted' or 'rejected'"
      });
    }

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Permission: only project manager can review
    const project = await ProjectModel.findById(task.project);
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only project manager can review tasks"
      });
    }

    // Update review fields
    task.reviewStatus = reviewStatus;
    task.reviewedBy = req.user._id;
    task.reviewedAt = new Date();
    task.reviewNotes = reviewNotes || "";
    await task.save();

    // Send notification to assignee
    if (NotificationModel) {
      const message =
        reviewStatus === "accepted"
          ? `Your task "${task.title}" has been accepted`
          : `Your task "${task.title}" has been rejected`;

      await NotificationModel.create({
        userId: task.assignee,
        type: "task_reviewed",
        message,
        project: task.project,
        task: taskId,
        read: false
      });
    }

    // Log activity
    if (ActivityLogModel) {
      await ActivityLogModel.create({
        project: task.project,
        userId: req.user._id,
        action: "task_reviewed",
        details: `Task reviewed - ${reviewStatus}`,
        metadata: { taskId, reviewStatus, reviewNotes }
      });
    }

    const reviewed = await TaskModel.findById(taskId)
      .populate("assignee", "name email")
      .populate("reviewedBy", "name email")
      .lean();

    res.status(200).json({
      success: true,
      message: `Task ${reviewStatus} successfully`,
      task: reviewed
    });
  } catch (error) {
    console.error("reviewTask error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ============================================
// DELETE TASK (Manager only)
// ============================================
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Permission: only project manager
    const project = await ProjectModel.findById(task.project);
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only project manager can delete tasks"
      });
    }

    await TaskModel.findByIdAndDelete(taskId);

    // Log activity
    if (ActivityLogModel) {
      await ActivityLogModel.create({
        project: task.project,
        userId: req.user._id,
        action: "task_deleted",
        details: `Task "${task.title}" deleted`,
        metadata: { taskId }
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("deleteTask error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ============================================
// CREATE PERSONAL NOTE (Any user)
// ============================================
export const createPersonalNote = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    // Personal notes have no project
    const note = new TaskModel({
      title,
      description: description || "",
      project: null,
      assignee: null,
      createdBy: req.user._id,
      isPersonal: true,
      status: "todo"
    });

    await note.save();

    const saved = await TaskModel.findById(note._id).lean();

    res.status(201).json({
      success: true,
      message: "Personal note created successfully",
      note: saved
    });
  } catch (error) {
    console.error("createPersonalNote error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ============================================
// GET PERSONAL NOTES (Current user only)
// ============================================
export const getPersonalNotes = async (req, res) => {
  try {
    const userId = req.user._id;

    const notes = await TaskModel.find({
      createdBy: userId,
      $or: [{ project: null }, { project: { $exists: false } }]
    })
      .sort({ updatedAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: notes.length,
      notes
    });
  } catch (error) {
    console.error("getPersonalNotes error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ============================================
// UPDATE PERSONAL NOTE
// ============================================
export const updatePersonalNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, description, status } = req.body;

    const note = await TaskModel.findById(noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    // Permission: only creator
    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own notes"
      });
    }

    if (title) note.title = title;
    if (description !== undefined) note.description = description;
    if (status) note.status = status;

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note
    });
  } catch (error) {
    console.error("updatePersonalNote error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ============================================
// DELETE PERSONAL NOTE
// ============================================
export const deletePersonalNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await TaskModel.findById(noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    // Permission: only creator
    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own notes"
      });
    }

    await TaskModel.findByIdAndDelete(noteId);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully"
    });
  } catch (error) {
    console.error("deletePersonalNote error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};