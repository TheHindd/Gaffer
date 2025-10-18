import express from "express";
import {
  createTask,
  getProjectTasks,
  getTask,
  updateTaskStatus,
  updateTask,
  reviewTask,
  deleteTask,
  createPersonalNote,
  getPersonalNotes,
  updatePersonalNote,
  deletePersonalNote
} from "../controllers/taskController.js";
import { authenticateMiddle, authorizeRoles } from "../middleware/authMiddle.js";

const taskRouter = express.Router();

//PROJECT TASKS ENDPOINTS

taskRouter.post("/",  authenticateMiddle,  createTask);
taskRouter.get("/project/:projectId", authenticateMiddle, getProjectTasks);
taskRouter.get("/:taskId", authenticateMiddle, getTask);
taskRouter.patch("/:taskId/status", authenticateMiddle, updateTaskStatus);
taskRouter.patch(  "/:taskId", authenticateMiddle, authorizeRoles("manager", "admin"), updateTask);
taskRouter.post( "/:taskId/review", authenticateMiddle, authorizeRoles("manager", "admin"), reviewTask);
taskRouter.delete(  "/:taskId",  authenticateMiddle, authorizeRoles("manager", "admin"),  deleteTask);

// PERSONAL NOTES ENDPOINTS
taskRouter.post("/notes/create", authenticateMiddle, createPersonalNote);
taskRouter.get("/notes", authenticateMiddle, getPersonalNotes);
taskRouter.patch("/notes/:noteId", authenticateMiddle, updatePersonalNote);
taskRouter.delete("/notes/:noteId", authenticateMiddle, deletePersonalNote);

export default taskRouter;