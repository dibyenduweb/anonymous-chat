import { useEffect, useRef } from "react";
import { useMessages } from "../hooks/useMessages";
import MessageBubble from "./MessageBubble";
import EmptyChat from "./EmptyChat";

export default function MessageList({ chatId, currentUserId }) {
  const { messages, loading } = useMessages(chatId, currentUserId);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return <EmptyChat />;
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-chat-bg">
      {messages.map((msg, index) => {
        const isMe = msg.senderId === currentUserId;
        const showName = !isMe && (index === 0 || messages[index - 1].senderId !== msg.senderId);
        return (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            isMe={isMe} 
            showName={showName} 
          />
        );
      })}
    </div>
  );
}