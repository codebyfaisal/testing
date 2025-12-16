import api from "./axios";

const authService = {
    login: async (credentials) => {
        const response = await api.post("/users/login", credentials);
        return response.data.data;
    },
    logout: async () => {
        const response = await api.post("/users/logout");
        return response.data.data;
    },
    getUser: async () => {
        const response = await api.get("/users/me");
        return response.data.data;
    },
    updateUser: async (data) => {
        const response = await api.patch("/users/me", data);
        return response.data.data;
    },
    checkAdminExists: async () => {
        const response = await api.get("/users/admin-exists");
        return response.data.data;
    },
    register: async (userData) => {
        const response = await api.post("/users/register", userData);
        return response.data.data;
    },
    changePassword: async (data) => {
        const response = await api.post("/users/me/change-password", data);
        return response.data.data;
    },
};

export default authService;
