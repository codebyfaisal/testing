import dashboardService from '../../api/dashboard.service';

export const createBlogSlice = (set, get) => ({
    posts: [],
    currentPost: null,

    // Actions
    fetchPosts: async (params) => {
        set({ isLoading: true });
        try {
            const data = await dashboardService.getPosts(params);
            set({ posts: data.posts || [] });
            return data;
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            set({ isLoading: false });
        }
    },

    getPostBySlug: async (slug) => {
        set({ isLoading: true });
        try {
            const post = await dashboardService.getPostBySlug(slug);
            set({ currentPost: post });
            return post;
        } catch (error) {
            console.error("Failed to fetch post", error);
        } finally {
            set({ isLoading: false });
        }
    },

    createPost: async (postData) => {
        set({ isLoading: true });
        try {
            const newPost = await dashboardService.createPost(postData);
            set((state) => ({
                posts: [newPost, ...state.posts]
            }));
            return newPost;
        } catch (error) {
            console.error("Failed to create post", error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updatePost: async (id, postData) => {
        set({ isLoading: true });
        try {
            const updatedPost = await dashboardService.updatePost(id, postData);
            set((state) => ({
                posts: state.posts.map((p) => (p._id === id ? updatedPost : p)),
                currentPost: (state.currentPost && state.currentPost._id === id) ? updatedPost : state.currentPost
            }));
            return updatedPost;
        } catch (error) {
            console.error("Failed to update post", error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deletePost: async (id) => {
        set({ isLoading: true });
        try {
            await dashboardService.deletePost(id);
            set((state) => ({
                posts: state.posts.filter((p) => p._id !== id)
            }));
        } catch (error) {
            console.error("Failed to delete post", error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    resetBlogState: () => {
        set({ posts: [], isLoading: true, currentPost: null });
    },
});
