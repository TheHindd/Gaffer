import TaskModel from "../models/taskModel.js";
import ProjectModel from "../models/projectModel.js";


// CREATE TASK (Manager or Assistant)
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    if (!title || !projectId || !assignedTo || !priority || !dueDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // ✅ Allow managers or assistants
    const isManager = project.createdBy.toString() === req.user._id.toString();
    const isAssistant = project.assistants.includes(req.user._id);

    if (!isManager && !isAssistant) {
      return res.status(403).json({ message: "Access denied" });
    }

    const newTask = new TaskModel({
      title,
      description,
      projectId,
      assignedTo,
      priority,
      dueDate,
      status: "To Do",
      createdBy: req.user._id,
    });

    await newTask.save();

    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// UPDATE TASK (Manager or Assigned User)
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await TaskModel.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only manager or assigned user can update
    if (
      task.assignedTo.toString() !== req.user._id.toString() &&
      req.user.role !== "manager"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;

    await task.save();

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// DELETE TASK (Manager only)
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await TaskModel.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Only managers can delete tasks" });
    }

    await TaskModel.findByIdAndDelete(taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
