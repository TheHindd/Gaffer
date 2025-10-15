import express from "express"; 
import { createProject, getProjectDetails, getProjectsForUser, updateProject } from "../controllers/projectController.js";


const projectRouter = express.Router();

projectRouter.post("/createNewProject",createProject);
projectRouter.put("/updateProject/:projectId", updateProject);
projectRouter.get("/getProjects", getProjectsForUser);
projectRouter.get("/getProjectDetails",getProjectDetails);
export default projectRouter;