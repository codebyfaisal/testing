import axios from "@/api/axios";

export const createFormSlice = (set, get) => ({
    forms: [],

    fetchForms: async () => {
        set({ isLoading: true });
        try {
            const { data } = await axios.get("/forms");
            set({ forms: data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    addForm: async (formData) => {
        set({ isLoading: true });
        try {
            const { data } = await axios.post("/forms", formData);
            set((state) => ({
                forms: [data.data, ...state.forms],
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    updateForm: async (id, updates) => {
        set({ isLoading: true });
        try {
            const { data } = await axios.put(`/forms/${id}`, updates);
            set((state) => ({
                forms: state.forms.map((f) =>
                    f._id === id ? data.data : f
                ),
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    deleteForm: async (id) => {
        set({ isLoading: true });
        try {
            await axios.delete(`/forms/${id}`);
            set((state) => ({
                forms: state.forms.filter((f) => f._id !== id),
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },
});
