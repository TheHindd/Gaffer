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

import { authenticateMiddle, authorizeRoles } from "../middleware/authMiddleware.js";

const ProjectRouter = express.Router();

// Projects
router.post("/", authenticateMiddle, authorizeRoles("admin", "manager"), createProject); // managers & admins create projects
router.get("/", authenticateMiddle, getProjectsForUser); // returns projects for user (or all for admin)
router.get("/dashboard", authenticateMiddle, getDashboard); // user's dashboard
router.get("/:projectId/details", authenticateMiddle, getProjectDetails);
router.patch("/:projectId", authenticateMiddle, authorizeRoles("admin", "manager"), updateProject);
router.post("/:projectId/archive", authenticateMiddle, authorizeRoles("admin", "manager"), archiveProject);

// Grant assistant (only project owner/manager can call — controller checks ownership)
router.post("/grant-access", authenticateMiddle, authorizeRoles("admin", "manager"), grantAssistantAccess);

export default ProjectRouter;
