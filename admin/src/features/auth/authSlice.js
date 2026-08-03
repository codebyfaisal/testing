import authService from './auth.service';
import { getErrorMessage } from "@/store/utils";

export const createAuthSlice = (set, get) => ({
    user: null,
    hasAdmin: null,
    isLoadingAuth: false, // Specific loading state for auth to avoid conflicts
    authError: null,

    checkAdminStatus: async () => {
        set({ isLoadingAuth: true });
        try {
            const { hasAdmin } = await authService.checkAdminExists();
            set({ hasAdmin, isLoadingAuth: false });
            return hasAdmin;
        } catch (error) {
            console.error("Failed to check admin status:", error);
            set({ hasAdmin: false, isLoadingAuth: false });
        }
    },

    login: async (credentials) => {
        set({ isLoadingAuth: true, authError: null });
        try {
            const { user } = await authService.login(credentials);
            set({ user, isLoadingAuth: false });
            return user;
        } catch (error) {
            const message = getErrorMessage(error);
            set({ authError: message, isLoadingAuth: false });
            throw new Error(message);
        }
    },

    logout: async () => {
        set({ isLoadingAuth: true });
        try {
            await authService.logout();
        } catch (error) {
            if (import.meta.env.DEV) {
                console.warn("Server logout notification failed:", error);
            }
        } finally {
            // Complete memory and storage wipe (SEC-009)
            set({
                user: null,
                isLoadingAuth: false,
                authError: null,
                projects: null,
                projectPromise: null,
                posts: [],
                currentPost: null,
                blogRequestId: null,
                messages: null,
                messagePromise: null,
                forms: null,
                formPromise: null,
                jobs: [],
                applications: [],
            });
            try {
                localStorage.clear();
                sessionStorage.clear();
            } catch (storageErr) {
                // Ignore storage clear issues if blocked
            }
        }
    },

    getUser: async () => {
        set({ isLoadingAuth: true });
        try {
            const user = await authService.getUser();
            set({ user, isLoadingAuth: false });
            return user;
        } catch (error) {
            set({ user: null, isLoadingAuth: false });
        }
    },

    updateUser: async (userData) => {
        set({ isLoadingAuth: true });
        try {
            const updatedUser = await authService.updateUser(userData);
            set({ user: updatedUser, isLoadingAuth: false });
            return updatedUser;
        } catch (error) {
            const message = getErrorMessage(error);
            set({ authError: message, isLoadingAuth: false });
            throw new Error(message);
        }
    },

    changePassword: async (data) => {
        set({ isLoadingAuth: true });
        try {
            await authService.changePassword(data);
            set({ isLoadingAuth: false });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ authError: message, isLoadingAuth: false });
            throw new Error(message);
        }
    },
    resetAuthLoading: () => {
        set({ isLoadingAuth: true });
    },
});
