import mongoose from "mongoose";
import ProjectModel from "../models/Project.js";
import ProjectMemberModel from "../models/ProjectMember.js";
import ChatRoomModel from "../models/ChatRoom.js";
import ActivityLogModel from "../models/ActivityLog.js"; // if you have it
import TaskModel from "../models/Task.js";
import FileModel from "../models/File.js";



//create project 

export const createProject = async (req,res) => {

    const {title, description} = req.body;

    if (!title){ 
        return res.status(400).json({message: "Title and End Date are required"});
    }

    try {        
        const existingTitle = await ProjectModel.findOne({title});

        if (existingTitle){
            return res.status(400).json({message: "Project title must be unique"});
        }

        const newProject = new ProjectModel ({
            title,
            description,
            //createdBy: req.user._id
        });

        await newProject.save();

        res.status(201).json({message: "Project created successfully"});        
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});        
    }};


//update project

export const updateProject = async (req, res ) => {

    const {projectId} = req.params;
    const {title, description, status, endDate} = req.body;  

    try {
        const updateFields = {title, description, status, endDate};

        const project = await ProjectModel.findByIdAndUpdate(projectId, updateFields, {new: true});

        if (!project){
            return res.status(404).json({message: "Project not found"});
        }
        res.status(200).json({message: "Project updated successfully"});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};


//get all projects

export const getAllProjects = async (req, res) => {
    try {
        const projects = await ProjectModel.find();
        res.status(200).json({projects});        
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

//get project by title

export const getProjectByTitle = async (req, res) => {
    const {title} = req.body; 
    try {
        const projects = await ProjectModel.find({ title:new RegExp(title, "i")}).select();
        
        if (projects.length === 0) {
            return res.status(404).json({ message: "No project found" });
        }
        res.status(200).json({projects});        
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

//delete Project
