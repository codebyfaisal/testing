import dashboardService from '../../api/dashboard.service';
import { getErrorMessage } from '../utils';

export const createStatSlice = (set, get) => ({
    overview: null,
    overviewPromise: null,
    visitorStats: null,
    visitorStatsPromise: null,
    visits: null,
    isLoadingOverview: true,
    isLoadingVisitorStats: true,
    isLoadingVisits: true,
    // Deprecated single loader for backward compatibility if needed, using a getter? 
    // For now we remove isLoadingStats usage or map it. 
    // But existing components (Visitors.jsx) rely on isLoadingStats. 
    // We will keep isLoadingStats as a computed property or sync it with isLoadingVisits? 
    // Better to rename in components. But to avoid breaking, let's keep isLoadingStats mirroring isLoadingVisits or just remove it and fix components.
    // I will fix components.
    statsError: null,

    fetchOverviewStats: async () => {
        const { overviewPromise } = get();
        if (overviewPromise) return overviewPromise;

        set({ isLoadingOverview: true });

        const promise = dashboardService.getOverviewStats().then((stats) => {
            set({ overview: stats, overviewPromise: null, isLoadingOverview: false });
            return stats;
        }).catch((error) => {
            set({ isLoadingOverview: false });
            throw error;
        });

        set({ overviewPromise: promise });
        return promise;
    },

    fetchVisitorStats: async () => {
        const { visitorStatsPromise } = get();
        if (visitorStatsPromise) return visitorStatsPromise;

        set({ isLoadingVisitorStats: true }); // Explicitly set loading

        const promise = dashboardService.getVisitorStats().then((stats) => {
            set({ visitorStats: stats, visitorStatsPromise: null, isLoadingVisitorStats: false });
            return stats;
        }).catch((error) => {
            set({ isLoadingVisitorStats: false });
            throw error;
        });

        set({ visitorStatsPromise: promise });
        return promise;
    },

    fetchVisits: async (params) => {
        set({ isLoadingVisits: true, statsError: null });
        try {
            const data = await dashboardService.getVisits(params);
            set({ visits: data, isLoadingVisits: false });
            return data;
        } catch (error) {
            console.error("Fetch visits failed", error);
            set({ statsError: getErrorMessage(error), isLoadingVisits: false });
        }
    },

    deleteVisits: async (ids) => {
        set({ isLoadingVisits: true });
        try {
            await dashboardService.deleteVisits(ids);

            // Local update (Optimistic UI)
            const { visits } = get();
            if (visits && visits.visits) {
                const newVisits = visits.visits.filter(v => !ids.includes(v._id));
                set({
                    visits: {
                        ...visits,
                        visits: newVisits,
                        meta: {
                            ...visits.meta,
                            total: Math.max(0, visits.meta.total - ids.length)
                        }
                    },
                    isLoadingVisits: false
                });
            } else {
                set({ isLoadingVisits: false });
            }

            // Refresh stats to ensure consistency
            get().fetchVisitorStats();
        } catch (error) {
            set({ statsError: getErrorMessage(error), isLoadingVisits: false });
            throw error;
        }
    },

    wipeAllVisits: async () => {
        set({ isLoadingVisits: true });
        try {
            await dashboardService.cleanupVisits();

            // Optimistic Clear
            const { visits } = get();
            if (visits) {
                set({
                    visits: {
                        ...visits,
                        visits: [],
                        meta: { ...visits.meta, total: 0 }
                    },
                    isLoadingVisits: false
                });
            } else {
                set({ isLoadingVisits: false });
            }

            get().fetchVisitorStats();
        } catch (error) {
            set({ statsError: getErrorMessage(error), isLoadingVisits: false });
            throw error;
        }
    },
    resetStatsState: () => {
        set({
            overview: null,
            overviewPromise: null,
            visitorStats: null,
            visitorStatsPromise: null,
            visits: null,
            isLoadingOverview: true,
            isLoadingVisitorStats: true,
            isLoadingVisits: true,
            statsError: null
        });
    },
});
