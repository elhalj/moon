import { axiosInstance } from "../lib/axios";
import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  typingUsers: {}, // { userId: boolean }

  getUser: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
      set({
        messages: [...get().messages, newMessage],
        typingUsers: { ...get().typingUsers, [newMessage.senderId]: false },
      });
    });

    // Écouter l'événement userTyping
    socket.on("userTyping", ({ userId }) => {
      set({
        typingUsers: { ...get().typingUsers, [userId]: true },
      });
    });

    // Écouter l'événement userStopTyping
    socket.on("userStopTyping", ({ userId }) => {
      set({
        typingUsers: { ...get().typingUsers, [userId]: false },
      });
    });
  },

  unSubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("userTyping");
    socket.off("userStopTyping");
  },

  handleTyping: (isTyping) => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    // Émettre l'événement via socket.io pour une réponse immédiate
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.emit(isTyping ? "typing" : "stopTyping", selectedUser._id);
    }
    
    // Appeler également l'API REST pour assurer la persistance
    try {
      axiosInstance.post(`/message/typing/${selectedUser._id}`, { isTyping });
    } catch (error) {
      console.error("Error in handleTyping API call", error);
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
