import dashboardService from '../../api/dashboard.service';
import { getErrorMessage } from '../utils';

export const createTestimonialSlice = (set, get) => ({
    testimonials: null,
    testimonialPromise: null,

    fetchTestimonials: async () => {
        const { testimonials, testimonialPromise } = get();

        if (testimonials !== null) {
            if (testimonialPromise) return testimonialPromise;
            const resolved = Promise.resolve(testimonials);
            set({ testimonialPromise: resolved });
            return resolved;
        }

        if (testimonialPromise) return testimonialPromise;

        set({ isLoading: true });
        try {
            const promise = dashboardService.getTestimonials().then((data) => {
                const safeData = data || [];
                set({
                    testimonials: safeData,
                    testimonialPromise: Promise.resolve(safeData),
                    isLoading: false
                });
                return safeData;
            });

            set({ testimonialPromise: promise });
            return promise;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    addTestimonial: async (testimonialData) => {
        set({ isLoading: true });
        try {
            const newTestimonial = await dashboardService.createTestimonial(testimonialData);
            set((state) => {
                const newTestimonials = [...(state.testimonials || []), newTestimonial];
                return {
                    testimonials: newTestimonials,
                    testimonialPromise: Promise.resolve(newTestimonials),
                    isLoading: false
                };
            });
            return newTestimonial;
        } catch (error) {
            set({ isLoading: false });
            throw new Error(getErrorMessage(error));
        }
    },

    updateTestimonial: async (id, testimonialData) => {
        set({ isLoading: true });
        try {
            const updatedTestimonial = await dashboardService.updateTestimonial(id, testimonialData);
            set((state) => {
                const newTestimonials = state.testimonials.map(t => t._id === id ? updatedTestimonial : t);
                return {
                    testimonials: newTestimonials,
                    testimonialPromise: Promise.resolve(newTestimonials),
                    isLoading: false
                };
            });
            return updatedTestimonial;
        } catch (error) {
            set({ isLoading: false });
            throw new Error(getErrorMessage(error));
        }
    },

    deleteTestimonial: async (id) => {
        set({ isLoading: true });
        try {
            await dashboardService.deleteTestimonial(id);
            set((state) => {
                const newTestimonials = state.testimonials.filter(t => t._id !== id);
                return {
                    testimonials: newTestimonials,
                    testimonialPromise: Promise.resolve(newTestimonials),
                    isLoading: false
                };
            });
        } catch (error) {
            set({ isLoading: false });
            throw new Error(getErrorMessage(error));
        }
    },
    resetTestimonialState: () => {
        set({ testimonials: null, isLoading: true, testimonialPromise: null });
    },
});
