import dashboardService from '../../api/dashboard.service';

export const createConfigSlice = (set, get) => ({
    config: { rounded: true }, // Default

    updateConfig: async (configData) => {
        set((state) => ({
            config: { ...state.config, ...configData }
        }));
        try {
            await dashboardService.updateConfig(configData);
        } catch (err) {
            console.error("Config update failed", err);
            throw err;
        }
    },

    getConfig: async () => {
        try {
            const config = await dashboardService.getConfig();
            set((state) => ({
                config: { ...state.config, ...config }
            }));
            return config;
        } catch (e) {
            console.error("Failed to fetch config", e);
        }
    },

    resetConfigState: () => {
        set({ config: null, isLoading: true });
    },
});
