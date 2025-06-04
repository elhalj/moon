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
  // typingUsers: {}, // { userId: boolean }

  // Fonction utilitaire pour mettre à jour typingUsers
  // updateTypingStatus: (userId, isTyping) => {
  //   console.log(`Mise à jour du statut de typing pour ${userId}: ${isTyping}`);
  //   set((state) => ({
  //     typingUsers: {
  //       ...state.typingUsers,
  //       [userId]: isTyping,
  //     },
  //   }));
  //   console.log("Nouveau typingUsers:", get().typingUsers);
  // },

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
        // typingUsers: { ...get().typingUsers, [newMessage.senderId]: false },
      });
    });

    // Écouter l'événement userTyping
    // socket.on("userTyping", ({ userId }) => {
    //   console.log(`Événement userTyping reçu de ${userId}`);
    //   console.log("Avant mise à jour, typingUsers:", get().typingUsers);
    //   // Utiliser la fonction utilitaire pour mettre à jour le statut
    //   get().updateTypingStatus(userId, true);
    // });

    // Écouter l'événement userStopTyping
    // socket.on("userStopTyping", ({ userId }) => {
    //   console.log(`Événement userStopTyping reçu de ${userId}`);
    //   console.log("Avant mise à jour, typingUsers:", get().typingUsers);
    //   // Utiliser la fonction utilitaire pour mettre à jour le statut
    //   get().updateTypingStatus(userId, false);
    // });
  },

  unSubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("userTyping");
    socket.off("userStopTyping");
  },

  // handleTyping: (isTyping) => {
  //   const { selectedUser } = get();
  //   if (!selectedUser) return;

  //   console.log(
  //     `Envoi de l'événement ${isTyping ? "typing" : "stopTyping"} pour ${
  //       selectedUser._id
  //     }`
  //   );

  //   // Émettre l'événement via socket.io pour une réponse immédiate
  //   const socket = useAuthStore.getState().socket;
  //   if (socket) {
  //     socket.emit(isTyping ? "typing" : "stopTyping", selectedUser._id);
  //   } else {
  //     console.error("Socket non disponible pour envoyer l'événement de typing");
  //   }

  //   // Appeler également l'API REST pour assurer la persistance
  //   try {
  //     axiosInstance.post(`/message/typing/${selectedUser._id}`, { isTyping });
  //   } catch (error) {
  //     console.error("Error in handleTyping API call", error);
  //   }
  // },

  setSelectedUser: (selectedUser) => {
    // Réinitialiser typingUsers lors du changement d'utilisateur
    set({
      selectedUser,
      // typingUsers: {},
    });
  },
}));
