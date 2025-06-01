import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAthStore";
import arriere from "../assets/arriere2.jpeg";
import { formatMessageTime } from "../lib/utils";

function ChatContainer() {
  const {
    messages,
    getMessages,
    selectedUser,
    isMessageLoading,
    subscribeToMessages,
    unSubscribeFromMessages,
    typingUsers,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  useEffect(() => {
    if (selectedUser && selectedUser._id) {
      getMessages(selectedUser._id);
    }

    subscribeToMessages();
    
    // Log pour déboguer
    console.log("ChatContainer monté avec selectedUser:", selectedUser);
    console.log("typingUsers initial:", typingUsers);

    return () => {
      unSubscribeFromMessages();
      console.log("ChatContainer démonté");
    };
  }, [selectedUser, getMessages, subscribeToMessages, unSubscribeFromMessages, typingUsers]);

  useEffect(() => {
    if (messageEndRef && messages)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Effet pour surveiller les changements dans typingUsers
  useEffect(() => {
    console.log("typingUsers a changé:", typingUsers);
    if (selectedUser) {
      console.log(`L'utilisateur ${selectedUser._id} est-il en train d'écrire? ${typingUsers[selectedUser._id] ? 'Oui' : 'Non'}`);
    }
  }, [typingUsers, selectedUser]);

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || arriere
                      : selectedUser.profilePic || arriere
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        {/* Log de débogage pour l'indicateur de typing */}
        {console.log("Rendu - Condition d'affichage:", {
          selectedUser: selectedUser ? selectedUser._id : 'aucun',
          typingUsers: typingUsers,
          isTyping: selectedUser && typingUsers ? !!typingUsers[selectedUser._id] : false
        })}
        {selectedUser && typingUsers && typingUsers[selectedUser._id] === true && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={selectedUser.profilePic || arriere}
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-bubble bg-gray-700 flex items-center gap-2">
              <span className="typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </span>
              <span>est en train d'écrire...</span>
            </div>
          </div>
        )}
        <div ref={messageEndRef} ></div>
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;
