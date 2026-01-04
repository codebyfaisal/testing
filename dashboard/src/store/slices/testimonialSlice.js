import dashboardService from '../../api/dashboard.service';
import { getErrorMessage } from '../utils';

export const createTestimonialSlice = (set, get) => ({
    testimonials: null,
    testimonialPromise: null,

    fetchTestimonials: () => {
        const { testimonials, testimonialPromise } = get();

        if (testimonials !== null) {
            if (testimonialPromise) return testimonialPromise;
            const resolved = Promise.resolve(testimonials);
            set({ testimonialPromise: resolved });
            return resolved;
        }

        if (testimonialPromise) return testimonialPromise;

        const promise = dashboardService.getTestimonials().then((data) => {
            const safeData = data || [];
            set({
                testimonials: safeData,
                testimonialPromise: Promise.resolve(safeData)
            });
            return safeData;
        });

        set({ testimonialPromise: promise });
        return promise;
    },

    addTestimonial: async (testimonialData) => {
        try {
            const newTestimonial = await dashboardService.createTestimonial(testimonialData);
            set((state) => {
                const newTestimonials = [...(state.testimonials || []), newTestimonial];
                return {
                    testimonials: newTestimonials,
                    testimonialPromise: Promise.resolve(newTestimonials)
                };
            });
            return newTestimonial;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    updateTestimonial: async (id, testimonialData) => {
        try {
            const updatedTestimonial = await dashboardService.updateTestimonial(id, testimonialData);
            set((state) => {
                const newTestimonials = state.testimonials.map(t => t._id === id ? updatedTestimonial : t);
                return {
                    testimonials: newTestimonials,
                    testimonialPromise: Promise.resolve(newTestimonials)
                };
            });
            return updatedTestimonial;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    deleteTestimonial: async (id) => {
        try {
            await dashboardService.deleteTestimonial(id);
            set((state) => {
                const newTestimonials = state.testimonials.filter(t => t._id !== id);
                return {
                    testimonials: newTestimonials,
                    testimonialPromise: Promise.resolve(newTestimonials)
                };
            });
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },
});
