import { useEffect, useRef, useCallback } from "react";
import { updateTypingStatus } from "../services/chatService";

export const useTyping = (chatId, userId, isTyping) => {
  const timeoutRef = useRef(null);

  const setTyping = useCallback((typing) => {
    if (!chatId || !userId) return;
    updateTypingStatus(chatId, userId, typing).catch(console.error);
  }, [chatId, userId]);

  useEffect(() => {
    if (isTyping) {
      setTyping(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setTyping(false);
      }, 2000); // Clear typing status after 2 seconds of inactivity
    } else {
      setTyping(false);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setTyping(false);
    };
  }, [isTyping, setTyping]);
};