import { create } from 'zustand';

// Import Slices
import { createAuthSlice } from './slices/authSlice';
import { createServiceSlice } from './slices/serviceSlice';
import { createPlanSlice } from './slices/planSlice';
import { createProjectSlice } from './slices/projectSlice';
import { createTestimonialSlice } from './slices/testimonialSlice';
import { createMessageSlice } from './slices/messageSlice';
import { createFileSlice } from './slices/fileSlice';
import { createStatSlice } from './slices/statSlice';
import { createConfigSlice } from './slices/configSlice';
import { createBlogSlice } from './slices/blogSlice';
import { createJobSlice } from './slices/jobSlice';
import { createFormSlice } from './slices/formSlice';
import { createUiSlice } from './slices/uiSlice';

const useDashboardStore = create((set, get, ...a) => ({
    isLoading: false,
    error: null,

    // Spread Slices
    ...createAuthSlice(set, get, ...a),
    ...createServiceSlice(set, get, ...a),
    ...createPlanSlice(set, get, ...a),
    ...createProjectSlice(set, get, ...a),
    ...createTestimonialSlice(set, get, ...a),
    ...createMessageSlice(set, get, ...a),
    ...createFileSlice(set, get, ...a),
    ...createStatSlice(set, get),
    ...createConfigSlice(set, get),
    ...createBlogSlice(set, get),
    ...createJobSlice(set, get),
    ...createFormSlice(set, get),
    ...createUiSlice(set, get),
}));

export default useDashboardStore;
