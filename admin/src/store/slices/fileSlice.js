import dashboardService from '../../api/dashboard.service';
import { getErrorMessage } from '../utils';

export const createFileSlice = (set, get) => ({
    isLoadingFiles: false,

    fetchFiles: async (resourceType = "image", nextCursor = null) => {
        set({ isLoadingFiles: true });
        try {
            const data = await dashboardService.getFiles(resourceType, nextCursor);
            set({ isLoadingFiles: false });
            return data;
        } catch (error) {
            set({ isLoadingFiles: false });
            throw error;
        }
    },

    uploadFile: async (file) => {
        set({ isLoadingFiles: true });
        try {
            const newMedia = await dashboardService.uploadFile(file);
            set({ isLoadingFiles: false });
            return newMedia;
        } catch (error) {
            set({ isLoadingFiles: false });
            throw new Error(getErrorMessage(error));
        }
    },

    deleteFile: async (publicId) => {
        set({ isLoadingFiles: true });
        try {
            const result = await dashboardService.deleteFile(publicId);
            set({ isLoadingFiles: false });
            return result;
        } catch (error) {
            set({ isLoadingFiles: false });
            throw new Error(getErrorMessage(error));
        }
    },
});
