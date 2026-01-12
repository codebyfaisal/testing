import dashboardService from "@/api/dashboard.service";

export const createJobSlice = (set, get) => ({
    jobs: [],
    job: null,
    applications: [],
    application: null,
    isApplicationsLoading: true,

    // Jobs
    fetchJobs: async (status = "") => {
        set({ isLoading: true, error: null });
        try {
            const params = status ? { status } : {};
            const data = await dashboardService.getJobs(params);
            set({ jobs: data });
            return data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to fetch jobs" });
        } finally {
            set({ isLoading: false });
        }
    },

    addJob: async (jobData) => {
        set({ isLoading: true, error: null });
        try {
            const data = await dashboardService.createJob(jobData);
            set((state) => ({ jobs: [data, ...state.jobs] }));
            return data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to add job" });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateJob: async (id, jobData) => {
        set({ isLoading: true, error: null });
        try {
            console.log(id, jobData);
            const data = await dashboardService.updateJob(id, jobData);
            set((state) => ({
                jobs: state.jobs.map((j) => (j._id === id ? data : j)),
                job: state.job?._id === id ? data : state.job
            }));
            return data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to update job" });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteJob: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await dashboardService.deleteJob(id);
            set((state) => ({
                jobs: state.jobs.filter((j) => j._id !== id),
                job: state.job?._id === id ? null : state.job
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to delete job" });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Applications
    fetchApplications: async (filters = {}) => {
        set({ isApplicationsLoading: true, error: null });
        try {
            // filters can be { jobId, search, status, from, to }
            // dashboardService.getApplications sends params directly
            const data = await dashboardService.getApplications(filters);
            set({ applications: data });
            return data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to fetch applications" });
        } finally {
            set({ isApplicationsLoading: false });
        }
    },

    updateApplicationStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
            const data = await dashboardService.updateApplication(id, { status });
            set((state) => ({
                applications: state.applications.map((app) =>
                    app._id === id ? data : app
                ),
            }));
            return data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to update application status" });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteApplication: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await dashboardService.deleteApplication(id);
            set((state) => ({
                applications: state.applications.filter((a) => a._id !== id),
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to delete application" });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Reset Actions
    resetJobsState: () => {
        set({ jobs: [], isLoading: true });
    },

    resetApplicationsState: () => {
        set({ isApplicationsLoading: true, applications: [] });
    },
});
