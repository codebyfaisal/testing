import authService from '../../api/auth.service';
import { getErrorMessage } from '../utils';

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

    register: async (userData) => {
        set({ isLoadingAuth: true, authError: null });
        try {
            const user = await authService.register(userData);
            set({ user, isLoadingAuth: false });
            return user;
        } catch (error) {
            const message = getErrorMessage(error);
            set({ authError: message, isLoadingAuth: false });
            throw new Error(message);
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
            set({ user: null, isLoadingAuth: false });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ authError: message, isLoadingAuth: false });
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
});
