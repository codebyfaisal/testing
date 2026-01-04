import dashboardService from '../../api/dashboard.service';
import { getErrorMessage } from '../utils';

export const createProjectSlice = (set, get) => ({
    projects: null,
    projectPromise: null,

    fetchProjects: () => {
        const { projects, projectPromise } = get();

        if (projects !== null) {
            if (projectPromise) return projectPromise;
            const resolved = Promise.resolve(projects);
            set({ projectPromise: resolved });
            return resolved;
        }

        if (projectPromise) return projectPromise;

        const promise = dashboardService.getProjects().then((data) => {
            const safeData = data || [];
            set({
                projects: safeData,
                projectPromise: Promise.resolve(safeData)
            });
            return safeData;
        });

        set({ projectPromise: promise });
        return promise;
    },

    addProject: async (projectData) => {
        try {
            const newProject = await dashboardService.createProject(projectData);
            set((state) => {
                const newProjects = [...(state.projects || []), newProject];
                return {
                    projects: newProjects,
                    projectPromise: Promise.resolve(newProjects)
                };
            });
            return newProject;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    updateProject: async (id, projectData) => {
        try {
            const updatedProject = await dashboardService.updateProject(id, projectData);
            set((state) => {
                const newProjects = state.projects.map(p => p._id === id ? updatedProject : p);
                return {
                    projects: newProjects,
                    projectPromise: Promise.resolve(newProjects)
                };
            });
            return updatedProject;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    deleteProject: async (id) => {
        try {
            await dashboardService.deleteProject(id);
            set((state) => {
                const newProjects = state.projects.filter(p => p._id !== id);
                return {
                    projects: newProjects,
                    projectPromise: Promise.resolve(newProjects)
                };
            });
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },
});
