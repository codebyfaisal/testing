import api from "./axios";

const dashboardService = {
    // User
    getUser: async () => {
        const response = await api.get("/users/me");
        return response.data.data;
    },
    updateUser: async (data) => {
        const response = await api.patch("/users/me", data);
        return response.data.data;
    },
    getConfig: async () => {
        const response = await api.get("/users/me/config");
        return response.data.data;
    },
    getConfig: async () => {
        const response = await api.get("/users/me/config");
        return response.data.data;
    },
    updateConfig: async (data) => {
        const response = await api.post("/users/me/config", data);
        return response.data.data;
    },

    // Overview Stats
    getOverviewStats: async () => {
        const response = await api.get("/dashboard/stats");
        return response.data.data;
    },
    getVisitorStats: async () => {
        const response = await api.get("/visits/stats");
        return response.data.data;
    },
    getVisits: async (params) => {
        const response = await api.get("/visits", { params });
        return response.data.data;
    },
    deleteVisits: async (ids) => {
        const response = await api.delete("/visits", { data: { ids } });
        return response.data.data;
    },
    cleanupVisits: async () => {
        const response = await api.post("/visits/cleanup");
        return response.data.data;
    },

    // Services
    getServices: async () => {
        const response = await api.get("/services");
        return response.data.data;
    },
    createService: async (data) => {
        const response = await api.post("/services", data);
        return response.data.data;
    },
    updateService: async (id, data) => {
        const response = await api.patch(`/services/${id}`, data);
        return response.data.data;
    },
    deleteService: async (id) => {
        const response = await api.delete(`/services/${id}`);
        return response.data.data;
    },

    // Plans
    getPlans: async () => {
        const response = await api.get("/services/plans");
        return response.data.data;
    },
    createPlan: async (data) => {
        const response = await api.post("/services/plans", data);
        return response.data.data;
    },
    updatePlan: async (id, data) => {
        const response = await api.patch(`/services/plans/${id}`, data);
        return response.data.data;
    },
    deletePlan: async (id) => {
        const response = await api.delete(`/services/plans/${id}`);
        return response.data.data;
    },

    // Projects
    getProjects: async () => {
        const response = await api.get("/projects");
        return response.data.data;
    },
    createProject: async (data) => {
        const response = await api.post("/projects", data);
        return response.data.data;
    },
    updateProject: async (id, data) => {
        const response = await api.patch(`/projects/${id}`, data);
        return response.data.data;
    },
    deleteProject: async (id) => {
        const response = await api.delete(`/projects/${id}`);
        return response.data.data;
    },

    // Testimonials
    getTestimonials: async () => {
        const response = await api.get("/testimonials");
        return response.data.data;
    },
    createTestimonial: async (data) => {
        const response = await api.post("/testimonials", data);
        return response.data.data;
    },
    updateTestimonial: async (id, data) => {
        const response = await api.patch(`/testimonials/${id}`, data);
        return response.data.data;
    },
    deleteTestimonial: async (id) => {
        const response = await api.delete(`/testimonials/${id}`);
        return response.data.data;
    },

    // Messages
    getMessages: async () => {
        const response = await api.get("/messages");
        return response.data.data;
    },
    markMessageRead: async (id) => {
        const response = await api.patch(`/messages/${id}/read`);
        return response.data.data;
    },
    deleteMessage: async (id) => {
        const response = await api.delete(`/messages/${id}`);
        return response.data.data;
    },


    // Media / File Manager
    getFiles: async (resourceType = "image", nextCursor = null) => {
        const response = await api.get("/files", {
            params: { resourceType, nextCursor }
        });
        return response.data.data;
    },
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post("/files", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data.data;
    },
    deleteFile: async (publicId) => {
        const encodedId = encodeURIComponent(publicId);
        const response = await api.delete(`/files/${encodedId}`);
        return response.data.data;
    },
};

export default dashboardService;
