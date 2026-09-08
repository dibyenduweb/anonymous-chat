import { useState, useEffect } from "react";
import { subscribeToMessages, markMessagesAsRead } from "../services/chatService";

export const useMessages = (chatId, currentUserId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId || !currentUserId) return;

    markMessagesAsRead(chatId, currentUserId);

    const unsubscribe = subscribeToMessages(chatId, (fetchedMessages) => {
      setMessages(fetchedMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId, currentUserId]);

  return { messages, loading };
};