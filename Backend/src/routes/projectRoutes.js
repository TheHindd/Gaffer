import express from "express";
import {
  createProject,
  getProjectsForUser,
  getProjectDetails,
  updateProject,
  archiveProject,
  getDashboard,
  grantAssistantAccess
} from "../controllers/projectController.js";

import { authenticateMiddle, authorizeRoles } from "../middleware/authMiddle.js";

const ProjectRouter = express.Router();

// Projects
ProjectRouter.post("/", authenticateMiddle, authorizeRoles("admin", "manager"), createProject); // managers & admins create projects
ProjectRouter.get("/", authenticateMiddle, getProjectsForUser); // returns projects for user (or all for admin)
ProjectRouter.get("/dashboard", authenticateMiddle, getDashboard); // user's dashboard
ProjectRouter.get("/:projectId/details", authenticateMiddle, getProjectDetails);
ProjectRouter.patch("/:projectId", authenticateMiddle, authorizeRoles("admin", "manager"), updateProject);
ProjectRouter.post("/:projectId/archive", authenticateMiddle, authorizeRoles("admin", "manager"), archiveProject);

// Grant assistant (only project owner/manager can call — controller checks ownership)
ProjectRouter.post("/grant-access", authenticateMiddle, authorizeRoles("admin", "manager"), grantAssistantAccess);

export default ProjectRouter;
