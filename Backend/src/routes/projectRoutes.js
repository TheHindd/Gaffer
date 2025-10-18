import express from "express";
import {
  createProject,
  getProjectsForUser,
  getProjectDetails,
  updateProject,
  archiveProject,
  deleteProject,
  getDashboard,
  addTeamMember,
  grantAssistantAccess,
  revokeAssistantAccess
} from "../controllers/projectController.js";
import { authenticateMiddle, authorizeRoles } from "../middleware/authMiddle.js";

const projectRouter = express.Router();

// GET dashboard (upcoming tasks, personal notes, recent projects)
projectRouter.get("/dashboard", authenticateMiddle, getDashboard);

// CREATE project (Manager/Admin only)
projectRouter.post( "/", authenticateMiddle,  authorizeRoles("manager", "admin"), createProject);
projectRouter.get("/", authenticateMiddle, getProjectsForUser);
projectRouter.get("/:projectId", authenticateMiddle, getProjectDetails);
projectRouter.patch("/:projectId",authenticateMiddle, authorizeRoles("manager", "admin"), updateProject);
projectRouter.put("/:projectId/archive", authenticateMiddle, authorizeRoles("manager", "admin"), archiveProject);
projectRouter.delete( "/:projectId", authenticateMiddle, authorizeRoles("admin , manager"), deleteProject);

// TEAM MEMBER MANAGEMENT ENDPOINTS
projectRouter.post("/:projectId/members",
  authenticateMiddle,
  authorizeRoles("manager", "admin"),
  addTeamMember
);

projectRouter.post(
  "/:projectId/grant-assistant",
  authenticateMiddle,
  authorizeRoles("manager", "admin"),
  grantAssistantAccess
);

projectRouter.post(
  "/:projectId/revoke-assistant",
  authenticateMiddle,
  authorizeRoles("manager", "admin"),
  revokeAssistantAccess
);

export default projectRouter;