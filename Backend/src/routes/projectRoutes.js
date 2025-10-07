import express from "express"; 
import { createProject, getAllProjects, getProjectByTitle, updateProject } from "../controllers/projectController.js";


const projectRouter = express.Router();

projectRouter.post("/createNewProject",createProject);
projectRouter.put("/updateProject/:projectId", updateProject);
projectRouter.get("/getAllProjects",getAllProjects);
projectRouter.get("/getProjectByTitle",getProjectByTitle);
export default projectRouter;