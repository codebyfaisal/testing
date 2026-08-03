import { Project } from "./project.model.js";
import { ApiError } from "../../utils/ApiError.js";

const createProject = async (data) => {
    return await Project.create(data);
};

const getAllProjects = async () => {
    return await Project.find();
};

const getProjectById = async (id) => {
    const project = await Project.findById(id);
    if (!project) throw new ApiError(404, "Project not found");
    return project;
};

const updateProject = async (id, data) => {
    const project = await Project.findById(id);
    if (!project) throw new ApiError(404, "Project not found");

    const updatedProject = await Project.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
    );
    return updatedProject;
};

const deleteProject = async (id) => {
    const project = await Project.findByIdAndDelete(id);
    if (!project) throw new ApiError(404, "Project not found");
    return project;
};

const countProjects = async () => {
    return await Project.countDocuments();
};

export const ProjectService = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    countProjects
};
