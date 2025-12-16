import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createProject = asyncHandler(async (req, res) => {
    const { title, description, techStack, liveLink, githubLink, featured, features, images, date } = req.body;

    const project = await Project.create({
        title,
        description,
        images,
        techStack,
        liveLink,
        githubLink,
        featured,
        features,
        date
    });

    return res.status(201).json(
        new ApiResponse(201, project, "Project created successfully")
    );
});

const getAllProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find();
    return res.status(200).json(
        new ApiResponse(200, projects, "Projects fetched successfully")
    );
});

const getProjectById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) throw new ApiError(404, "Project not found");

    return res.status(200).json(
        new ApiResponse(200, project, "Project fetched successfully")
    );
});

const updateProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, techStack, liveLink, githubLink, featured, features, images, date } = req.body;

    const project = await Project.findById(id);
    if (!project) throw new ApiError(404, "Project not found");

    const updatedProject = await Project.findByIdAndUpdate(
        id,
        {
            $set: {
                title,
                description,
                images,
                techStack,
                liveLink,
                githubLink,
                featured,
                features,
                date
            }
        },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedProject, "Project updated successfully")
    );
});

const deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) throw new ApiError(404, "Project not found");

    return res.status(200).json(
        new ApiResponse(200, {}, "Project deleted successfully")
    );
});

export {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
};
