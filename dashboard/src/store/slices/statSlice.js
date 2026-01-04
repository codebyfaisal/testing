import dashboardService from '../../api/dashboard.service';
import { getErrorMessage } from '../utils';

export const createStatSlice = (set, get) => ({
    overview: null,
    overviewPromise: null,
    visitorStats: null,
    visitorStatsPromise: null,
    visits: null,
    isLoadingStats: false,
    statsError: null,

    fetchOverviewStats: async () => {
        const { overviewPromise } = get();
        if (overviewPromise) return overviewPromise;

        const promise = dashboardService.getOverviewStats().then((stats) => {
            set({ overview: stats, overviewPromise: null }); // Clear promise to allow re-fetch if needed later?
            return stats;
        });

        set({ overviewPromise: promise });
        return promise;
    },

    fetchVisitorStats: async () => {
        const { visitorStatsPromise } = get();
        // Caching approach: if fetching, return same promise.
        // We can allow re-fetching by checking if promise is null (which we set to null after completion)
        if (visitorStatsPromise) return visitorStatsPromise;

        const promise = dashboardService.getVisitorStats().then((stats) => {
            set({ visitorStats: stats, visitorStatsPromise: null });
            return stats;
        });

        set({ visitorStatsPromise: promise });
        return promise;
    },

    fetchVisits: async (params) => {
        set({ isLoadingStats: true, statsError: null });
        try {
            const data = await dashboardService.getVisits(params);
            set({ visits: data, isLoadingStats: false });
            return data;
        } catch (error) {
            console.error("Fetch visits failed", error);
            set({ statsError: getErrorMessage(error), isLoadingStats: false });
        }
    },

    deleteVisits: async (ids) => {
        set({ isLoadingStats: true });
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
                    isLoadingStats: false
                });
            } else {
                set({ isLoadingStats: false });
            }

            // Refresh stats to ensure consistency
            get().fetchVisitorStats();
        } catch (error) {
            set({ statsError: getErrorMessage(error), isLoadingStats: false });
            throw error;
        }
    },

    wipeAllVisits: async () => {
        set({ isLoadingStats: true });
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
                    isLoadingStats: false
                });
            } else {
                set({ isLoadingStats: false });
            }

            get().fetchVisitorStats();
        } catch (error) {
            set({ statsError: getErrorMessage(error), isLoadingStats: false });
            throw error;
        }
    },
});
