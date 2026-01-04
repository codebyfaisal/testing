import dashboardService from '../../api/dashboard.service';
import { getErrorMessage } from '../utils';

export const createPlanSlice = (set, get) => ({
    plans: null,
    planPromise: null,

    fetchPlans: () => {
        const { plans, planPromise } = get();

        if (plans !== null) {
            if (planPromise) return planPromise;
            const resolved = Promise.resolve(plans);
            set({ planPromise: resolved });
            return resolved;
        }

        if (planPromise) return planPromise;

        const promise = dashboardService.getPlans().then((data) => {
            const safeData = data || [];
            set({
                plans: safeData,
                planPromise: Promise.resolve(safeData)
            });
            return safeData;
        });

        set({ planPromise: promise });
        return promise;
    },

    addPlan: async (planData) => {
        try {
            const newPlan = await dashboardService.createPlan(planData);
            set((state) => {
                const newPlans = [...(state.plans || []), newPlan];
                return {
                    plans: newPlans,
                    planPromise: Promise.resolve(newPlans)
                };
            });
            return newPlan;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    updatePlan: async (id, planData) => {
        try {
            const updatedPlan = await dashboardService.updatePlan(id, planData);
            set((state) => {
                const newPlans = state.plans.map(p => p._id === id ? updatedPlan : p);
                return {
                    plans: newPlans,
                    planPromise: Promise.resolve(newPlans)
                };
            });
            return updatedPlan;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    deletePlan: async (id) => {
        try {
            await dashboardService.deletePlan(id);
            set((state) => {
                const newPlans = state.plans.filter(p => p._id !== id);
                return {
                    plans: newPlans,
                    planPromise: Promise.resolve(newPlans)
                };
            });
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },
});
