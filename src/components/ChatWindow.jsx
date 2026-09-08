import { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageComposer from "./MessageComposer";
import { getOrCreateChat } from "../services/chatService";
import { useTyping } from "../hooks/useTyping";

export default function ChatWindow({ targetUser, currentUserId, onBack }) {
  const [chatId, setChatId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (currentUserId && targetUser) {
      // We pass placeholder names here; the service will merge/update with actual names
      getOrCreateChat(currentUserId, targetUser.userId, "Current", targetUser.displayName)
        .then(setChatId)
        .catch((err) => console.error("Failed to create chat:", err));
    }
  }, [currentUserId, targetUser]);

  useTyping(chatId, currentUserId, isTyping);

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chat-bg">
        <div className="animate-pulse text-gray-500">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-chat-bg relative">
      <ChatHeader 
        user={targetUser} 
        currentUserId={currentUserId} 
        chatId={chatId}
        onBack={onBack} 
      />
      <MessageList chatId={chatId} currentUserId={currentUserId} />
      <MessageComposer 
        chatId={chatId} 
        currentUserId={currentUserId} 
        currentUserName={localStorage.getItem("anon_chat_displayName") || "Anonymous"}
        receiverId={targetUser.userId}
        onTyping={setIsTyping}
      />
    </div>
  );
}