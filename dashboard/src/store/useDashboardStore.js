import { create } from 'zustand';
import authService from '../api/auth.service';
import dashboardService from '../api/dashboard.service';

// Helper to extract error message
const getErrorMessage = (error) => {
    return error.response?.data?.message || error.message || "An unexpected error occurred";
};

const useDashboardStore = create((set, get) => ({
    data: {
        user: null,
        services: null,
        projects: null,
        testimonials: null,
        messages: null,
        media: null,
        config: { rounded: true },
        plans: null,
        overview: null,
        visitorStats: null,
        visits: null,
    },
    promises: {
        services: null,
        projects: null,
        testimonials: null,
        messages: null,
        media: null,
        currentUser: null,
        plans: null,
        overview: null
    },
    isLoading: false,
    error: null,
    user: null,
    hasAdmin: null,

    // Auth Actions
    checkAdminStatus: async () => {
        set({ isLoading: true });
        try {
            const { hasAdmin } = await authService.checkAdminExists();
            set({ hasAdmin, isLoading: false });
            return hasAdmin;
        } catch (error) {
            console.error("Failed to check admin status:", error);
            set({ hasAdmin: false, isLoading: false });
        }
    },

    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const user = await authService.register(userData);
            set({ user, data: { ...get().data, user }, isLoading: false });
            return user;
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const { user } = await authService.login(credentials);
            set({ user, data: { ...get().data, user }, isLoading: false });
            return user;
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await authService.logout();
            set({ user: null, data: { ...get().data, user: null }, isLoading: false });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message, isLoading: false });
        }
    },

    getUser: async () => {
        set({ isLoading: true });
        try {
            const user = await authService.getUser();
            set({ user, data: { ...get().data, user }, isLoading: false });
            return user;
        } catch (error) {
            set({ user: null, isLoading: false });
        }
    },

    updateUser: async (userData) => {
        set({ isLoading: true });
        try {
            const updatedUser = await authService.updateUser(userData);
            set({ user: updatedUser, data: { ...get().data, user: updatedUser }, isLoading: false });
            return updatedUser;
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },

    changePassword: async (data) => {
        set({ isLoading: true });
        try {
            await authService.changePassword(data);
            set({ isLoading: false });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },

    // Data Fetching Actions
    fetchServices: () => {
        const { promises, data } = get();
        if (data.services !== null) {
            if (promises.services) return promises.services;
            const resolved = Promise.resolve(data.services);
            set((state) => ({ promises: { ...state.promises, services: resolved } }));
            return resolved;
        }
        if (promises.services) return promises.services;

        const promise = dashboardService.getServices().then((services) => {
            const data = services || [];
            set((state) => ({
                data: { ...state.data, services: data },
                promises: { ...state.promises, services: Promise.resolve(data) }
            }));
            return data;
        });

        set((state) => ({ promises: { ...state.promises, services: promise } }));
        return promise;
    },

    fetchPlans: () => {

        const { promises, data } = get();
        if (data.plans !== null) {
            if (promises.plans) return promises.plans;
            const resolved = Promise.resolve(data.plans);
            set((state) => ({ promises: { ...state.promises, plans: resolved } }));
            return resolved;
        }
        if (promises.plans) return promises.plans;

        const promise = dashboardService.getPlans().then((plans) => {
            const data = plans || [];
            set((state) => ({
                data: { ...state.data, plans: data },
                promises: { ...state.promises, plans: Promise.resolve(data) }
            }));
            return data;
        });

        set((state) => ({ promises: { ...state.promises, plans: promise } }));
        return promise;
    },

    fetchProjects: () => {
        const { promises, data } = get();
        if (data.projects !== null) {
            if (promises.projects) return promises.projects;
            const resolved = Promise.resolve(data.projects);
            set((state) => ({ promises: { ...state.promises, projects: resolved } }));
            return resolved;
        }
        if (promises.projects) return promises.projects;

        const promise = dashboardService.getProjects().then((projects) => {
            const data = projects || [];
            set((state) => ({
                data: { ...state.data, projects: data },
                promises: { ...state.promises, projects: Promise.resolve(data) }
            }));
            return data;
        });

        set((state) => ({ promises: { ...state.promises, projects: promise } }));
        return promise;
    },

    fetchTestimonials: () => {
        const { promises, data } = get();
        if (data.testimonials !== null) {
            if (promises.testimonials) return promises.testimonials;
            const resolved = Promise.resolve(data.testimonials);
            set((state) => ({ promises: { ...state.promises, testimonials: resolved } }));
            return resolved;
        }
        if (promises.testimonials) return promises.testimonials;

        const promise = dashboardService.getTestimonials().then((testimonials) => {
            const data = testimonials || [];
            set((state) => ({
                data: { ...state.data, testimonials: data },
                promises: { ...state.promises, testimonials: Promise.resolve(data) }
            }));
            return data;
        });

        set((state) => ({ promises: { ...state.promises, testimonials: promise } }));
        return promise;
    },

    fetchMessages: () => {
        const { promises, data } = get();
        if (data.messages !== null) {
            if (promises.messages) return promises.messages;
            const resolved = Promise.resolve(data.messages);
            set((state) => ({ promises: { ...state.promises, messages: resolved } }));
            return resolved;
        }
        if (promises.messages) return promises.messages;

        const promise = dashboardService.getMessages().then((messages) => {
            const data = messages || [];
            set((state) => ({
                data: { ...state.data, messages: data },
                promises: { ...state.promises, messages: Promise.resolve(data) }
            }));
            return data;
        });

        set((state) => ({ promises: { ...state.promises, messages: promise } }));
        return promise;
    },

    // Service Actions
    addService: async (serviceData) => {
        try {
            const newService = await dashboardService.createService(serviceData);
            set((state) => {
                const newServices = [...(state.data.services || []), newService];
                return {
                    data: { ...state.data, services: newServices },
                    promises: { ...state.promises, services: Promise.resolve(newServices) }
                };
            });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message });
            throw new Error(message);
        }
    },
    updateService: async (id, serviceData) => {
        try {
            const updatedService = await dashboardService.updateService(id, serviceData);
            set((state) => {
                const newServices = state.data.services.map(s => s._id === id ? updatedService : s);
                return {
                    data: { ...state.data, services: newServices },
                    promises: { ...state.promises, services: Promise.resolve(newServices) }
                };
            });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message });
            throw new Error(message);
        }
    },
    deleteService: async (id) => {
        try {
            await dashboardService.deleteService(id);
            set((state) => {
                const newServices = state.data.services.filter(s => s._id !== id);
                return {
                    data: { ...state.data, services: newServices },
                    promises: { ...state.promises, services: Promise.resolve(newServices) }
                };
            });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message });
            throw new Error(message);
        }
    },

    // Plans Actions
    addPlan: async (planData) => {
        try {
            const newPlan = await dashboardService.createPlan(planData);
            set((state) => {
                const newPlans = [...(state.data.plans || []), newPlan];
                return {
                    data: { ...state.data, plans: newPlans },
                    promises: { ...state.promises, plans: Promise.resolve(newPlans) }
                };
            });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message });
            throw new Error(message);
        }
    },
    updatePlan: async (id, planData) => {
        try {
            const updatedPlan = await dashboardService.updatePlan(id, planData);
            set((state) => {
                const newPlans = state.data.plans.map(p => p._id === id ? updatedPlan : p);
                return {
                    data: { ...state.data, plans: newPlans },
                    promises: { ...state.promises, plans: Promise.resolve(newPlans) }
                };
            });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message });
            throw new Error(message);
        }
    },
    deletePlan: async (id) => {
        try {
            await dashboardService.deletePlan(id);
            set((state) => {
                const newPlans = state.data.plans.filter(p => p._id !== id);
                return {
                    data: { ...state.data, plans: newPlans },
                    promises: { ...state.promises, plans: Promise.resolve(newPlans) }
                };
            });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message });
            throw new Error(message);
        }
    },

    // Project Actions
    addProject: async (projectData) => {
        try {
            const newProject = await dashboardService.createProject(projectData);
            set((state) => {
                const newProjects = [...(state.data.projects || []), newProject];
                return {
                    data: { ...state.data, projects: newProjects },
                    promises: { ...state.promises, projects: Promise.resolve(newProjects) }
                };
            });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message });
            throw new Error(message);
        }
    },
    updateProject: async (id, projectData) => {
        try {
            const updatedProject = await dashboardService.updateProject(id, projectData);
            set((state) => {
                const newProjects = state.data.projects.map(p => p._id === id ? updatedProject : p);
                return {
                    data: { ...state.data, projects: newProjects },
                    promises: { ...state.promises, projects: Promise.resolve(newProjects) }
                };
            });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message });
            throw new Error(message);
        }
    },
    deleteProject: async (id) => {
        try {
            await dashboardService.deleteProject(id);
            set((state) => {
                const newProjects = state.data.projects.filter(p => p._id !== id);
                return {
                    data: { ...state.data, projects: newProjects },
                    promises: { ...state.promises, projects: Promise.resolve(newProjects) }
                };
            });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message });
            throw new Error(message);
        }
    },

    // Testimonial Actions
    addTestimonial: async (testimonialData) => {
        try {
            const newTestimonial = await dashboardService.createTestimonial(testimonialData);
            set((state) => {
                const newTestimonials = [...(state.data.testimonials || []), newTestimonial];
                return {
                    data: { ...state.data, testimonials: newTestimonials },
                    promises: { ...state.promises, testimonials: Promise.resolve(newTestimonials) }
                };
            });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message });
            throw new Error(message);
        }
    },
    updateTestimonial: async (id, testimonialData) => {
        try {
            const updatedTestimonial = await dashboardService.updateTestimonial(id, testimonialData);
            set((state) => {
                const newTestimonials = state.data.testimonials.map(t => t._id === id ? updatedTestimonial : t);
                return {
                    data: { ...state.data, testimonials: newTestimonials },
                    promises: { ...state.promises, testimonials: Promise.resolve(newTestimonials) }
                };
            });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message });
            throw new Error(message);
        }
    },
    deleteTestimonial: async (id) => {
        try {
            await dashboardService.deleteTestimonial(id);
            set((state) => {
                const newTestimonials = state.data.testimonials.filter(t => t._id !== id);
                return {
                    data: { ...state.data, testimonials: newTestimonials },
                    promises: { ...state.promises, testimonials: Promise.resolve(newTestimonials) }
                };
            });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message });
            throw new Error(message);
        }
    },

    // Message Actions
    markMessageRead: async (id) => {
        try {
            const updatedMessage = await dashboardService.markMessageRead(id);
            set((state) => {
                const newMessages = state.data.messages.map(m => m._id === id ? updatedMessage : m);
                return {
                    data: { ...state.data, messages: newMessages },
                    promises: { ...state.promises, messages: Promise.resolve(newMessages) }
                };
            });
        } catch (error) {
            console.error("Failed to mark message as read:", error);
        }
    },
    deleteMessage: async (id) => {
        try {
            await dashboardService.deleteMessage(id);
            set((state) => {
                const newMessages = state.data.messages.filter(m => m._id !== id);
                return {
                    data: { ...state.data, messages: newMessages },
                    promises: { ...state.promises, messages: Promise.resolve(newMessages) }
                };
            });
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message });
            throw new Error(message);
        }
    },

    // Media / File Manager Actions
    fetchFiles: async (resourceType = "image", nextCursor = null) => {
        // If simply fetching next page, we don't check cache in the same way, 
        // but for simplicity let's just always fetch for now or implement smarter caching.
        // For now, let's just allow refetching to ensure fresh data for file manager.
        set({ isLoading: true });
        try {
            const data = await dashboardService.getFiles(resourceType, nextCursor);
            // Note: data contains { resources, next_cursor }
            set({ isLoading: false });
            return data;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },
    uploadFile: async (file) => {
        set({ isLoading: true });
        try {
            const newMedia = await dashboardService.uploadFile(file);
            // We might want to refresh the media list or just return success
            // For now, let's return it so the UI can update
            set({ isLoading: false });
            return newMedia;
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },
    deleteFile: async (publicId) => {
        set({ isLoading: true });
        try {
            const result = await dashboardService.deleteFile(publicId);
            set({ isLoading: false });
            return result;
        } catch (error) {
            const message = getErrorMessage(error);
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },

    // Overview Actions
    fetchOverviewStats: async () => {
        // Always fetch fresh stats for overview
        const { promises, data } = get();

        // Return existing promise if already fetching to avoid double fetch
        if (promises.overview) return promises.overview;

        const promise = dashboardService.getOverviewStats().then((stats) => {
            set((state) => ({
                data: { ...state.data, overview: stats },
                promises: { ...state.promises, overview: null } // Clear promise when done
            }));
            return stats;
        });

        set((state) => ({ promises: { ...state.promises, overview: promise } }));
        return promise;
    },

    fetchVisitorStats: async () => {
        const { promises, data } = get();
        if (data.visitorStats) return data.visitorStats; // Return cached if exists? Maybe better to refresh on mount.
        // Let's allow refresh.

        const promise = dashboardService.getVisitorStats().then((stats) => {
            set((state) => ({
                data: { ...state.data, visitorStats: stats },
                promises: { ...state.promises, visitorStats: null }
            }));
            return stats;
        });

        set((state) => ({ promises: { ...state.promises, visitorStats: promise } }));
        return promise;
    },

    fetchVisits: async (params) => {
        set({ isLoading: true });
        try {
            const data = await dashboardService.getVisits(params);
            set((state) => ({
                data: { ...state.data, visits: data },
                isLoading: false
            }));
            return data;
        } catch (error) {
            console.error("Fetch visits failed", error);
            set({ error: getErrorMessage(error), isLoading: false });
        }
    },

    deleteVisits: async (ids) => {
        set({ isLoading: true });
        try {
            await dashboardService.deleteVisits(ids);

            // Local update
            const { visits } = get().data;
            if (visits && visits.visits) {
                const newVisits = visits.visits.filter(v => !ids.includes(v._id));
                set((state) => ({
                    data: {
                        ...state.data,
                        visits: {
                            ...state.data.visits,
                            visits: newVisits,
                            meta: {
                                ...state.data.visits.meta,
                                total: Math.max(0, state.data.visits.meta.total - ids.length)
                            }
                        }
                    },
                    isLoading: false
                }));
            } else {
                set({ isLoading: false });
            }
            // Trigger refresh to be safe
            get().fetchVisitorStats();
        } catch (error) {
            console.error("Delete visits failed", error);
            set({ error: getErrorMessage(error), isLoading: false });
            throw error; // Re-throw for UI to handle
        }
    },

    wipeAllVisits: async () => {
        set({ isLoading: true });
        try {
            await dashboardService.cleanupVisits();
            // Optimistic: Clear all
            set((state) => ({
                data: {
                    ...state.data,
                    visits: {
                        ...state.data.visits,
                        visits: [],
                        meta: { ...state.data.visits.meta, total: 0 }
                    }
                },
                isLoading: false
            }));
            get().fetchVisitorStats(); // Refresh stats
        } catch (error) {
            set({ isLoading: false, error: getErrorMessage(error) });
            throw error;
        }
    },

    updateConfig: (configData) => {
        set((state) => ({
            data: { ...state.data, config: { ...state.data.config, ...configData } }
        }));
        dashboardService.updateConfig(configData)
            .catch((err) => console.error("Config update failed", err));
    },

    getConfig: async () => {
        try {
            const config = await dashboardService.getConfig();
            set((state) => ({
                data: { ...state.data, config: { ...state.data.config, ...config } }
            }));
            return config;
        } catch (e) {
            console.error("Failed to fetch config", e);
        }
    }
}));

export default useDashboardStore;
