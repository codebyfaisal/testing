import dashboardService from '../../api/dashboard.service';
import { getErrorMessage } from '../utils';

export const createServiceSlice = (set, get) => ({
    services: null, // Top-level state
    servicePromise: null, // Promise caching

    fetchServices: async () => {
        const { services, servicePromise } = get();

        // If data exists, return resolved promise
        if (services !== null) {
            if (servicePromise) return servicePromise;
            const resolved = Promise.resolve(services);
            set({ servicePromise: resolved });
            return resolved;
        }

        // If already fetching, return existing promise
        if (servicePromise) return servicePromise;

        set({ isLoading: true });

        // Fetch
        try {
            const promise = dashboardService.getServices().then((data) => {
                const safeData = data || [];
                set({
                    services: safeData,
                    servicePromise: Promise.resolve(safeData),
                    isLoading: false
                });
                return safeData;
            });

            set({ servicePromise: promise });
            return promise;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    addService: async (serviceData) => {
        set({ isLoading: true });
        try {
            const newService = await dashboardService.createService(serviceData);
            set((state) => {
                const newServices = [...(state.services || []), newService];
                return {
                    services: newServices,
                    servicePromise: Promise.resolve(newServices),
                    isLoading: false
                };
            });
            return newService;
        } catch (error) {
            set({ isLoading: false });
            throw new Error(getErrorMessage(error));
        }
    },

    updateService: async (id, serviceData) => {
        set({ isLoading: true });
        try {
            const updatedService = await dashboardService.updateService(id, serviceData);
            set((state) => {
                const newServices = state.services.map(s => s._id === id ? updatedService : s);
                return {
                    services: newServices,
                    servicePromise: Promise.resolve(newServices),
                    isLoading: false
                };
            });
            return updatedService;
        } catch (error) {
            set({ isLoading: false });
            throw new Error(getErrorMessage(error));
        }
    },

    deleteService: async (id) => {
        set({ isLoading: true });
        try {
            await dashboardService.deleteService(id);
            set((state) => {
                const newServices = state.services.filter(s => s._id !== id);
                return {
                    services: newServices,
                    servicePromise: Promise.resolve(newServices),
                    isLoading: false
                };
            });
        } catch (error) {
            set({ isLoading: false });
            throw new Error(getErrorMessage(error));
        }
    },
    resetServiceState: () => {
        set({ services: null, isLoading: true, servicePromise: null });
    },
});
