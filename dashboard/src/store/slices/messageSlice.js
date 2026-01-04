import dashboardService from '../../api/dashboard.service';
import { getErrorMessage } from '../utils';

export const createMessageSlice = (set, get) => ({
    messages: null,
    messagePromise: null,

    fetchMessages: () => {
        const { messages, messagePromise } = get();

        if (messages !== null) {
            if (messagePromise) return messagePromise;
            const resolved = Promise.resolve(messages);
            set({ messagePromise: resolved });
            return resolved;
        }

        if (messagePromise) return messagePromise;

        const promise = dashboardService.getMessages().then((data) => {
            const safeData = data || [];
            set({
                messages: safeData,
                messagePromise: Promise.resolve(safeData)
            });
            return safeData;
        });

        set({ messagePromise: promise });
        return promise;
    },

    markMessageRead: async (id) => {
        try {
            const updatedMessage = await dashboardService.markMessageRead(id);
            set((state) => {
                const newMessages = state.messages.map(m => m._id === id ? updatedMessage : m);
                return {
                    messages: newMessages,
                    messagePromise: Promise.resolve(newMessages)
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
                const newMessages = state.messages.filter(m => m._id !== id);
                return {
                    messages: newMessages,
                    messagePromise: Promise.resolve(newMessages)
                };
            });
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },
});
