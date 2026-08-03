import api from "@/api/axios";

const authService = {
    login: async (credentials) => {
        const response = await api.post("/auth/login", credentials);

        return response.data.data;
    },
    logout: async () => {
        const response = await api.post("/auth/logout");
        return response.data.data;
    },
    getUser: async () => {
        try {
            const response = await api.get("/users/me");
            return response.data.data;
        } catch (error) {
            console.error("Error getting user:", error);
            throw error;
        }
    },
    updateUser: async (data) => {
        const response = await api.put("/users/me", data);
        return response.data.data;
    },
    checkAdminExists: async () => {
        const response = await api.get("/auth/admin-exists");
        return response.data.data;
    },
    changePassword: async (data) => {
        const response = await api.post("/auth/me/change-password", data);
        return response.data.data;
    },
};

export default authService;
