import { create } from 'zustand';
import { fetchPortfolioData } from '../services/api';

const usePortfolioStore = create((set) => ({
    data: null,
    loading: true,
    error: null,
    isRounded: false,
    config: {},
    user: {},
    plans: [],

    fetchData: async () => {
        set({ loading: true, error: null });
        try {
            const data = await fetchPortfolioData();
            set({
                data,
                loading: false,
                isRounded: data?.config?.appearance?.theme?.borderRadius || false,
                config: data?.config,
                user: data?.user,
                plans: data?.plans
            });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
}));

export default usePortfolioStore;
